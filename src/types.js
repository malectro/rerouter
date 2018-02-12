// @flow

import type {RerouterAction} from './actions';

import * as React from 'react';


export type Route = {
  path?: string,
  component?: React.ComponentType<*>,
  children?: Route[],
};

export type Path = {
  part: ?string,
  routeIndex: number,
  params: Params,
}[];

export type Params = {
  [string]: string,
};

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
