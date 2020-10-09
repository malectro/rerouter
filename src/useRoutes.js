// @flow

import type {SyncRoute} from './types';

import * as React from 'react';
import {matchSync, resolveSyncPath} from './path';
import {useLocation} from './hooks';


export function useRoutes(routes: SyncRoute[]) {
  const location = useLocation();

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
      {contextValue.path.reduceRight((children, {route}) => route.element ?
        route.element({params: contextValue.params, children})
        : children, null)}
    </RouteContext.Provider>
  );
}

export const RouteContext = React.createContext();
