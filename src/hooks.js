// @flow

import {useContext} from 'react';
import {RouterContext} from './history-context';
import {RouteContext} from './route-context';


export function useHistory() {
  return useContext(RouterContext).history;
}

export function useLocation() {
  return useHistory().location;
}

export function useParams() {
  return useContext(RouteContext).params;
}
