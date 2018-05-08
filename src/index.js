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
export {default as Link} from './link.jsx';
export {default as Provider} from './component';
export {applyRouter, initDOMContext, createMiddleware} from './middleware';
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

export type {State} from 'reducer';
export type {Transition} from './types';
