// @flow


import type {RerouterLocation, Params} from './types';
import type {BaseHistory} from './history/base';
import {useContext} from 'react';
import {HistoryContext} from './history-context';
import {RouteContext} from './route-context';


export function useHistory(): BaseHistory {
  return useContext(HistoryContext).history;
}

export function useLocation(): RerouterLocation {
  return useHistory().location;
}

export function useParams(): Params {
  return useContext(RouteContext).params;
}
