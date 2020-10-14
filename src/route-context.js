import {createContext} from 'react';

export const RouteContext = createContext({
  pathname: '',
  path: [],
  params: {},
});
