// @flow

import {createContext, type Context} from 'react';
import type {SyncPath, Params} from './types';


export type RouteContextValue = {
  pathname: string,
  path: SyncPath,
  params: Params,
};

export const RouteContext: Context<RouteContextValue> = createContext({
  pathname: '',
  path: [],
  params: {},
});
