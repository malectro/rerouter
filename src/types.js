// @flow strict

import type {BaseHistory} from './history/base';
import * as React from 'react';


export type Params = $ReadOnly<{
  [string]: string,
}>;

export type RerouterLocation = {
  href: string,
  pathname: string,
  search: string,
  searchParams: URLSearchParams,
  query: Query,
  hash: string,
};
export type LocationType = $Shape<RerouterLocation> | string;
export type LocationArg = LocationType | (RerouterLocation => LocationType);

export type Query = {
  [string]: string,
};

export type LeaveHook = (
  nextLocation?: RerouterLocation,
) => void | string | Promise<void>;

export type PopStateListener = () => mixed;

export type ElementContext = {
  params: Params,
  pathPart: string,
  pathname: string,
  location: RerouterLocation,
  history: BaseHistory,
  children: React.Node,
};

export type GetElement = ElementContext => React.Node;

export type SyncRoute = {
  path?: string,
  element?: React.Node | GetElement,
  children?: SyncRoutes,
  exact?: boolean,
};

export type SyncRoutes = Array<
  SyncRoute | null | false | void
>;

export type SyncPath = {
  part: ?string,
  pathname: string,
  parentPathname: string,
  route: SyncRoute,
  params: Params,
}[];

export type RouterContextValue = {
  history: BaseHistory,
  routes: SyncRoute[],
  path: SyncPath,
  params: Params,
};
