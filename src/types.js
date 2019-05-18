// @flow

import type {RerouterAction} from './actions';
import type {State} from './reducer';

import * as React from 'react';

import Routes from './routes';


export type Route<C> = {
  path?: string,
  require?: (C) => boolean,
  component?: React.ComponentType<*>,
  getComponent?: () => PossibleDefaultExport<React.ComponentType<mixed>>,
  children?: RouteCollection<C>,
  loadChildren?: () => PossibleDefaultExport<RouteCollection<C>>,
};

export type RouteCollection<C> = Route<C>[] | (C) => Route<C>[];

export type PathNode = {
  part: ?string,
  routeIndex: number,
  params: Params,
};
export type Path = PathNode[];

export type Params = {
  [string]: string,
};

export type RouteResolution = {path: Path, params: Params};

export type Location = {
  pathname: string,
  query?: Query,
  search?: string,
};
export type LocationType = Location | string;

export type Query = {
  [string]: string,
};

export type Action = {
  type: 'not a rerouter action type',
  payload: any,
};

export type Dispatch = RerouterAction => any;
export type GetState = () => State;
export type ReduxStore = {dispatch: Dispatch, getState: GetState};

export type Transition = (
  meta: {routes: Routes, store: ReduxStore, location: Location},
  resolution: RouteResolution,
) => Promise<RouteResolution>;

export type LeaveHook = (
  nextLocation: Location,
) => void | string | Promise<void>;

export type PopStateListener = () => mixed;

export type PossibleDefaultExport<Thing: Object> = Promise<
  | {
      default: Thing,
    }
  | Thing,
>;
