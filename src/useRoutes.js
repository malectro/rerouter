// @flow

import type {SyncRoute} from './types';

import * as React from 'react';
import {matchSync, resolveSyncPath} from './path';
import {RouteContext} from './route-context';
import {useHistory} from './hooks';


export function useRoutes(routes: SyncRoute[]) {
  const history = useHistory();
  const {location} = history;
  const parent = React.useContext(RouteContext);

  const pathname = location.pathname.slice(parent.pathname.length);

  const contextValue = React.useMemo(
    () => {
      const path = matchSync(routes, pathname);
      const localContext = resolveSyncPath(path);
      return {
        pathname: parent.pathname + localContext.pathname,
        params: {...parent.params, ...localContext.params},
        path,
      };
    },
    [routes, pathname],
  );

  console.log('contextValue', contextValue);

  console.log(
    'content',
    contextValue.path.reduceRight(
      (children, {route}) =>
        route.element ?
          typeof route.element === 'function' ?
            route.element({params: contextValue.params, children})
            : route.element
          : children,
      null,
    ),
  );

  return (
    <RouteContext.Provider value={contextValue}>
      {contextValue.path.reduceRight(
        (children, {route}) =>
          route.element ?
            typeof route.element === 'function' ?
              route.element({params: contextValue.params, location, history, children})
              : route.element
            : children,
        null,
      )}
    </RouteContext.Provider>
  );
}
