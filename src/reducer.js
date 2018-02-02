// @flow

import type {Route, Location, LocationType, Query, Action} from './types';
import type {RerouterAction} from './actions';

import invariant from 'invariant';

import {PUSH, REPLACE, POP, HANDLE_POP} from './actions';


export type State = {
  history?: History,
  location: Location,
  path: {
    route: Route,
    params: Query,
  }[],
  params: Query,
};

export default function reduce({routes, history, location}: {
  routes: Route[],
  history?: History,
  location: Location,
}, router: State = {
  history,
  location,
  path: match(routes, location.pathname),
  params: {},
}, action: RerouterAction) {
  switch (action.type) {
    case PUSH:
      invariant(router.history, 'The rerouter action PUSH was dispatched without an initialized history. It is okay to not initialize history in a server-side context, but rerouter actions should never be dispatched.');
      router.history.pushState({}, '', massageLocation(action.payload));
      break;

    case REPLACE:
      invariant(router.history, 'The rerouter action REPLACE was dispatched without an initialized history. It is okay to not initialize history in a server-side context, but rerouter actions should never be dispatched.');
      router.history.replaceState({}, '', massageLocation(action.payload));
      break;

    case POP:
      invariant(router.history, 'The rerouter action POP was dispatched without an initialized history. It is okay to not initialize history in a server-side context, but rerouter actions should never be dispatched.');
      router.history.back();
      return router;

    case HANDLE_POP:
      break;

    default:
      return router;
  }

  const path = match(routes, location.pathname);
  const params = path.reduce((allParams, {params}) => ({...allParams, ...params})) || {};

  return {
    ...router,
    params,
    path,
  };
}

function massageLocation(location: LocationType) {
  if (typeof location !== 'string') {
    let {pathname = '', query, search} = location;

    if (query) {
      const keys = Object.keys(query);
      if (keys.length) {
        search = `?${keys.map(key => `${key}=${query[key]}`).join('&')}`;
      }
    }

    location = pathname + (search || '');
  }
  return location
}

export function match(routes: Route[], pathname: string) {
  for (let route of routes) {
    const {path, children} = route;

    if (children) {
      let matchInfo;
      if (!path) {
        matchInfo = {
          length: 0,
          params: {},
        };
      } else {
        matchInfo = matches(path, pathname);
      }

      if (matchInfo) {
        const trail = match(children, pathname.slice(matchInfo.length));
        if (trail) {
          trail.push({
            route,
            params: matchInfo.params,
          });
          return trail;
        }
      }

    // NOTE (kyle): trick to check if string is defined
    } else if (path != null) {
      const matchInfo = matches(path, pathname);
      if (matchInfo && matchInfo.length === pathname.length) {
        return [{
          route,
          params: matchInfo.params,
        }];
      }
    }
  }
  return [];
}

function matches(routePath: string, pathname: string) {
  const routeMatcher = pathToRegex(routePath);
  const match = routeMatcher.regex.exec(pathname);

  if (match) {
    const params = {};
    for (let i = 1; i < match.length; i++) {
      params[routeMatcher.params[i]] = match[i];
    }
    return {
      length: match[0].length,
      params,
    };
  }
}

function pathToRegex(path: string) {
  const params = /:([^\/]+)/g.exec(path);
  const string = path.replace(/:([^\/]+)/g, '([^/]+)').replace('*', '[^/]*');
  return {
    regex: new RegExp(`^/?${string}`),
    params,
  };
}
