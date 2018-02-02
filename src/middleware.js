import reduce from './reducer';
import {handlePop} from './actions';


export const applyRouter = (routes, history, location) => mainReducer => (state, action) => {
  state = mainReducer(state, action);
  return {...state, router: reduce({routes, history, location}, state.router, action)};
};

export const initDOMContext = (store) => {
  window.addEventListener('popstate', () => {
    store.dispatch(handlePop());
  });
};
