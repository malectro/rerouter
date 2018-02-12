// @flow

import type {ComponentType} from 'react';
import type {Route, Path} from './types';

import invariant from 'invariant';


export function match(routes: Route[], pathname: string) {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
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
            part: path,
            routeIndex: i,
            params: matchInfo.params,
          });
          return trail;
        }
      }

      // NOTE (kyle): trick to check if string is defined
    } else if (path != null) {
      const matchInfo = matches(path, pathname);
      if (matchInfo && matchInfo.length === pathname.length) {
        return [
          {
            part: path,
            routeIndex: i,
            params: matchInfo.params,
          },
        ];
      }
    }
  }
  return [];
}

export function getParams(path: Path) {
  return (
    path.reduce((allParams, {params}) => ({...allParams, ...params})) || {}
  );
}

export function getComponents(
  path: Path,
  routes: Route[],
): ComponentType<any>[] {
  let currentChildren = routes;
  // $FlowIssue flow doesn't seem to work with filter
  return path
    .map(({routeIndex}) => {
      invariant(
        currentChildren,
        'Attempted to get components for an invalid path.',
      );
      const route = currentChildren[routeIndex];
      currentChildren = route.children;
      return route.component;
    })
    .filter(component => component);
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
