// @flow

import type {Route, Location} from './types';
import type {RerouterAction} from './actions';
import type {State} from './reducer';

import reduce from './reducer';
import {handlePop} from './actions';
import {createLocation} from './utils';


export const applyRouter = (
  routes: Route[],
  history?: History,
  location: Location,
) => (mainReducer: Function) => (
  state: {router: State},
  action: RerouterAction,
) => {
  state = mainReducer(state, action);
  return {
    ...state,
    router: reduce(
      {routes, history, location: createLocation(location)},
      state.router,
      action,
    ),
  };
};

export const initDOMContext = store => {
  window.addEventListener('popstate', () => {
    store.dispatch(handlePop());
  });
};
