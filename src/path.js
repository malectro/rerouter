// @flow

import type {ComponentType} from 'react';
import type {Route, Path} from './types';

import invariant from 'invariant';

// TODO (kyle): handle failed async route resolution
export async function match(routes: Route[], pathname: string) {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const {path, getComponent} = route;
    let {children} = route;

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
        // NOTE (kyle): async load and monkey patch children
        if (typeof children === 'function') {
          route.children = children = useDefault(await children());
        }

        const trail = await match(children, pathname.slice(matchInfo.length));
        if (trail && trail.length > 0) {
          trail.unshift({
            part: path,
            routeIndex: i,
            params: matchInfo.params,
          });

          if (getComponent) {
            route.component = useDefault(await getComponent());
          }

          return trail;
        }
      }

      // NOTE (kyle): trick to check if string is defined
    }

    if (path != null) {
      const matchInfo = matches(path, pathname);
      if (matchInfo && matchInfo.length === pathname.length) {
        if (getComponent) {
          route.component = useDefault(await getComponent());
        }

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
    path.reduce((allParams, {params}) => ({...allParams, ...params}), {}) || {}
  );
}

export function getRoutePath(path: Path, routes: Route[]): Route[] {
  let currentChildren = routes;
  // $FlowIssue flow doesn't seem to work with filter
  return path.map(({routeIndex}) => {
    invariant(
      currentChildren,
      'Attempted to get components for an invalid path.',
    );
    const route = currentChildren[routeIndex];

    invariant(route, 'Attempted to get components for an invalid path.');

    currentChildren = route.children;
    return route;
  });
}

export function getComponents(
  path: Path,
  routes: Route[],
): ComponentType<any>[] {
  return getRoutePath(path, routes)
    .map(({component}) => component)
    .filter(Boolean);
}

export function matches(routePath: string, pathname: string) {
  const routeMatcher = pathToRegex(routePath);
  const match = routeMatcher.regex.exec(pathname);

  if (match) {
    const params = {};
    for (let i = 1; i < match.length; i++) {
      params[routeMatcher.params[i - 1]] = match[i];
    }
    return {
      length: match[0].length,
      params,
    };
  }
}

export function pathToRegex(path: string) {
  const params = pathToParams(path);
  const string = path.replace(/:([^\/]+)/g, '([^/]+)').replace('*', '.*');
  return {
    regex: new RegExp(`^/?${string}`),
    params,
  };
}

function pathToParams(path: string) {
  const regex = /:([^\/]+)/g;
  let match;
  const params = [];
  while ((match = regex.exec(path))) {
    params.push(match[1]);
  }
  return params;
}

function useDefault<T: Object>(thing: {default: T} | T): T {
  return thing.default || thing;
}
