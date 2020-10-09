// @flow

import {useContext} from 'react';
import {RouterContext} from './context';


export function useHistory() {
  return useContext(RouterContext).history;
}

export function useLocation() {
  return useHistory().location;
}
