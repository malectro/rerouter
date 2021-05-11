// @flow strict

// NOTE (kyle): Before modifying anything in this folder. Please read the adjacent README.md file.

export type {
  RerouterLocation,
  LocationArg,
  Params,
  Query,
  GetElement,
  ElementContext,
  SyncRoute,
  SyncRoutes,
} from './types';
export {default as Link} from './link';
export {BaseHistory as RouterHistory} from './history/base';
export {default as BrowserHistory} from './history/browser';
export {default as ServerHistory} from './history/server';
export {useHistory, useLocation, useParams} from './hooks';
export {useRoutes} from './useRoutes';
export {RouterProvider} from './provider';
export {extractParams} from './path';
