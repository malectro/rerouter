// @flow strict

import type {SyncRoutes, RerouterLocation} from './types';

import * as React from 'react';
import {matchSync, resolveSyncPath} from './path';
import {RouteContext, type RouteContextValue} from './route-context';
import {useHistory} from './hooks';


export function useRoutes(routes: SyncRoutes): [
  React.Node,
  RouteContextValue,
  RerouterLocation,
] {
  const history = useHistory();
  const {location} = history;
  const parent = React.useContext(RouteContext);

  const pathname = location.pathname.slice(parent.pathname.length);

  const contextValue = React.useMemo(
    () => {
      const path = matchSync(routes, pathname, parent.pathname);
      const localContext = resolveSyncPath(path);
      return {
        pathname: parent.pathname + localContext.pathname,
        params: {...parent.params, ...localContext.params},
        path,
      };
    },
    [routes, pathname],
  );

  return [
    <RouteContext.Provider value={contextValue}>
      {contextValue.path.reduceRight(
        (children, {route, pathname, parentPathname}) =>
          route.element ?
            typeof route.element === 'function' ?
              route.element({
                params: contextValue.params,
                pathPart: pathname,
                pathname: parentPathname + pathname,
                location,
                history,
                children,
              })
              : route.element
            : children,
        null,
      )}
    </RouteContext.Provider>,
    contextValue,
    location,
  ];
}
