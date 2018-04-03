// @flow

import type {Route, Location, GetState, Dispatch} from './types';
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
) => ({dispatch: Dispatch, getState: GetState}) => (next: Function) => (
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
