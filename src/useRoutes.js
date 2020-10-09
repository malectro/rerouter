// @flow

import type {SyncRoute} from './types';

import * as React from 'react';
import {matchSync, resolveSyncPath} from './path';
import {useLocation} from './hooks';


export function useRoutes(routes: SyncRoute[]) {
  const location = useLocation();

  console.log('got new location', location.pathname);

  const contextValue = React.useMemo(
    () => {
      const path = matchSync(routes, location.pathname);
      return {
        ...resolveSyncPath(path),
        path,
      };
    },
    [routes, location.pathname],
  );

  return (
    <RouteContext.Provider value={contextValue}>
      {contextValue.path.reduceRight((children, {route, params}) => route.element ?
        route.element({params, children})
        : children, null)}
    </RouteContext.Provider>
  );
}

export const RouteContext = React.createContext();
