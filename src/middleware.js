// @flow

import type {Route, Path, Params, Location, GetState, Dispatch} from './types';
import type {RerouterAction} from './actions';
import type {State} from './reducer';

import invariant from 'invariant';

import {PUSH, REPLACE, POP, HANDLE_POP, handlePop, route} from './actions';
import reduce from './reducer';
import Routes from './routes';
import {createLocation, stringifyLocation} from './utils';
import {match, getParams} from './path';


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

export const initDOMContext = store => {
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
    ({routes: Routes, path: Path, params: Params}) => Promise<any>,
  > = [],
  dependencyLocals?: {} = {},
) => (store: {dispatch: Dispatch, getState: GetState}) => (next: Function) => (
  action: RerouterAction,
) => {
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

    return routes
      .resolve(location.pathname)
      .then(async resolution => {
        for (let i = 0; i < transitionHooks.length; i++) {
          resolution = await transitionHooks[i](resolution);
        }

        return resolution;
      })
      .then(({path, params}) => {
        // TODO (kyle): make this standard to the rerouter lib
        // TODO (kyle): possibly have the app use Suspense for this
        const dependencies = routes
          .getComponents(path)
          .map(component => component['@@redial-hooks'])
          .filter(Boolean);

        const dependencyParams = {
          store,
          dispatch: store.dispatch,
          getState: store.getState,
          params,
          location,
          ...dependencyLocals,
        };

        return resolveDependencies(dependencies, 'required', dependencyParams)
          .then(async () => {
            const deferred = resolveDependencies(
              dependencies,
              'deferred',
              dependencyParams,
              true,
            );

            if (typeof window === 'undefined') {
              await deferred;
            } else {
              resolveDependencies(
                dependencies,
                'clientSide',
                dependencyParams,
                true,
              );
            }

            return {path, params};
          })
          .catch(error => {
            // TODO (kyle): 500
            console.error('Error fetching required', error);

            return {path, params};
          });
      })
      .then(({path, params}) =>
        next(route({path, params, location: createLocation(location)})),
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

function resolveDependencies(dependencies, name, params, handleErrors = false) {
  let promise = Promise.all(
    dependencies
      .map(deps => deps[name])
      .filter(Boolean)
      .map(resolver => resolver(params)),
  );

  if (handleErrors) {
    promise = promise.catch(error => {
      console.error('Error fetching', error);
    });
  }

  return promise;
}
