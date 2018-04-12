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

export type {State} from 'reducer';
