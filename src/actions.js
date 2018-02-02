// @flow

import type {Action, LocationType} from './types';


// actions
export const PUSH = '@@router/push';
export const REPLACE = '@@router/replace';
export const POP = '@@router/pop';
export const HANDLE_POP = '@@router/handlePop';


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

export type RerouterAction = Action | PushAction | ReplaceAction | PopAction | HandlePopAction;

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

