// @flow

import type {Path, Params, Location, ReduxStore} from './types';
import type {RerouterAction} from './actions';
import type {State} from './reducer';

import invariant from 'invariant';

import {PUSH, REPLACE, POP, HANDLE_POP, handlePop, route} from './actions';
import reduce from './reducer';
import Routes from './routes';
import {createLocation, stringifyLocation} from './utils';
import {AbortError} from './errors';


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
  location: Location,
  history?: History,
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
) => (store: ReduxStore) => (next: Function) => (action: RerouterAction) => {
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
        history.pushState({}, '', stringifyLocation(action.payload));
        break;

      case REPLACE:
        invariant(
          history,
          `The rerouter action ${
            action.type
          } was dispatched without an initialized history. It is okay to not initialize history in a server-side context, but rerouter actions should never be dispatched.`,
        );
        history.replaceState({}, '', stringifyLocation(action.payload));
        break;

      // HANDLE_POP does not modify history
      // TODO (kyle): consider allowing @@redux/INIT
    }

    const parsedLocation = createLocation(location);

    return routes
      .resolve(location.pathname)
      .then(async resolution => {
        for (let i = 0; i < transitionHooks.length; i++) {
          resolution = await transitionHooks[i](
            {routes, location: parsedLocation, store},
            resolution,
          );
        }

        return resolution;
      })
      .then(
        ({path, params}) =>
          // TODO (kyle): may need to rederrive the location from the path
          next(route({path, params, location: parsedLocation})),
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

    history.back();
  }

  return next(action);
};
