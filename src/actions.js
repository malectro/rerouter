// @flow

import type {Action, Location, LocationType, Path, Params} from './types';

// actions
export const PUSH = '@@router/push';
export const REPLACE = '@@router/replace';
export const POP = '@@router/pop';
export const HANDLE_POP = '@@router/handlePop';
export const ROUTE = '@@router/route';

export type PushAction = {
  type: '@@router/push',
  payload: LocationType,
};

export type ReplaceAction = {
  type: '@@router/replace',
  payload: LocationType,
};

export type PopAction = {
  type: '@@router/pop',
};

export type HandlePopAction = {
  type: '@@router/handlePop',
};

export type RouteAction = {
  type: '@@router/route',
  payload: {
    path: Path,
    params: Params,
  },
};

export type RerouterAction =
  | Action
  | PushAction
  | ReplaceAction
  | PopAction
  | HandlePopAction
  | RouteAction;

// action creators
export const push = (location: LocationType) => ({
  type: PUSH,
  payload: location,
});

export const replace = (location: LocationType) => ({
  type: REPLACE,
  payload: location,
});

export const pop = () => ({
  type: POP,
});

export const handlePop = () => ({
  type: HANDLE_POP,
});

export const route = (payload: {
  path: Path,
  params: Params,
  location: Location,
}) => ({
  type: ROUTE,
  payload,
});
