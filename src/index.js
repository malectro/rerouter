// TODO (kyle): figure out how to simplify these
import "core-js/stable";
import "regenerator-runtime/runtime";

export {
  PUSH,
  REPLACE,
  POP,
  HANDLE_POP,
  push,
  replace,
  pop,
  handlePop,
} from './actions';
export {useRouter, useLocation} from './hooks';
export {withRouter} from './hoc';
export {default as Link} from './link.jsx';
export {default as Provider} from './component';
export {applyRouter, createMiddleware} from './middleware';
export {default as reduce} from './reducer';
export {match, getParams, getComponents} from './path';
export {default as Routes} from './routes';
export {
  default as createDependencyTransition,
} from './transitions/dependencies';
export {
  browserRedirectTransition,
  createCustomRedirectTransition,
} from './transitions/redirect';
export {default as SimpleHistory} from './history/simple';
export {default as BrowserHistory} from './history/browser';
export {default as ServerHistory} from './history/server';
export {ReplaceError, AbortError} from './errors';

export type {State} from 'reducer';
export type {Transition} from './types';
