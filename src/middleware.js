// @flow

import type {Path, Params, Location, ReduxStore} from './types';
import type {RerouterAction} from './actions';
import type {State} from './reducer';
import type {BaseHistory} from './history/base';

import invariant from 'invariant';

import {PUSH, REPLACE, POP, HANDLE_POP, handlePop, route} from './actions';
import reduce from './reducer';
import Routes from './routes';
import {AbortError, ReplaceError} from './errors';


export const applyRouter = (mainReducer: Function) => (
  state: {router: State},
  action: RerouterAction,
) => {
  const router = state && state.router;
  state = mainReducer(state, action);
  return {
    ...state,
    router: reduce(router, action),
  };
};

export const initDOMContext = (store: ReduxStore) => {
  window.addEventListener('popstate', () => {
    store.dispatch(handlePop());
  });
};

const routeActions = new Set([PUSH, REPLACE, HANDLE_POP]);

export const createMiddleware = (
  routes: Routes,
  history: BaseHistory,
  transitionHooks?: Array<
    (
      {
        routes: Routes,
        location: Location,
        store: ReduxStore,
      },
      {path: Path, params: Params},
    ) => Promise<{path: Path, params: Params}>,
  > = [],
) => (store: ReduxStore) => (next: () => mixed) => (action: RerouterAction) => {
  const {type} = action;

  if (routeActions.has(type)) {
    switch (action.type) {
      case PUSH:
        invariant(
          history,
          `The rerouter action ${
            action.type
          } was dispatched without an initialized history. It is okay to not initialize history in a server-side context, but rerouter actions should never be dispatched.`,
        );
        history.push(action.payload);
        break;

      case REPLACE:
        invariant(
          history,
          `The rerouter action ${
            action.type
          } was dispatched without an initialized history. It is okay to not initialize history in a server-side context, but rerouter actions should never be dispatched.`,
        );
        history.replace(action.payload);
        break;

      // HANDLE_POP does not modify history
      // TODO (kyle): consider allowing @@redux/INIT
    }

    console.log('het', history.location);
    const parsedLocation = history.location;

    return routes
      .resolve(parsedLocation.pathname)
      .then(async resolution => {
        console.log('het');
        let replacementCount = 0;
        for (let i = 0; i < transitionHooks.length; i++) {
          try {
            resolution = await transitionHooks[i](
              {routes, location: history.location, store},
              resolution,
            );
          } catch (error) {
            if (error instanceof ReplaceError) {
              replacementCount++;
              if (replacementCount > 1) {
                console.warn(
                  'Multiple ReplaceErrors thrown in the same transition. Ignoring...',
                );
              } else {
                console.log('replacing');
                history.replace(error.location);
                resolution = await routes.resolve(history.location.pathname);
                i = 0;
              }
            } else {
              throw error;
            }
          }
        }

        console.log('hey');

        return resolution;
      })
      .then(
        ({path, params}) =>
          // TODO (kyle): may need to rederrive the location from the path
          next(route({path, params, location: history.location})),
        error => {
          if (error instanceof AbortError) {
            // pass
          } else {
            console.error('[rerouter] error during transition', error);
          }
        },
      );
  } else if (type === POP) {
    invariant(
      history,
      `The rerouter action ${
        action.type
      } was dispatched without an initialized history. It is okay to not initialize history in a server-side context, but rerouter actions should never be dispatched.`,
    );

    history.pop();
  }

  return next(action);
};
