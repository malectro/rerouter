// @flow

import type {ComponentType} from 'react';
import type {Route, RouteCollection, Path} from './types';

import invariant from 'invariant';



// TODO (kyle): handle failed async route resolution
export async function match<C>(routes: RouteCollection<C>, pathname: string, context: C) {
  routes = resolveRoutes(routes, context);

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const {path, getComponent, loadChildren} = route;
    let {children} = route;

    if (children || loadChildren) {
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
        if (!route.children && route.loadChildren) {
          route.children = children = useDefault(await route.loadChildren());
        }

        const trail = await match(children, pathname.slice(matchInfo.length), context);
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

function resolveRoutes<C>(routes: RouteCollection<C>, context: C): Array<Route<C>> {
  return typeof routes === 'function' ? routes(context) : routes;
}

export function getRoutePath<C>(path: Path, routes: RouteCollection<C>, context: C): Route<C>[] {
  let currentChildren = resolveRoutes(routes, context);
  // $FlowIssue flow doesn't seem to work with filter
  return path.map(({routeIndex}) => {
    invariant(
      currentChildren,
      'Attempted to get components for an invalid path.',
    );
    const route = currentChildren[routeIndex];

    invariant(route, 'Attempted to get components for an invalid path.');

    currentChildren = route.children ? resolveRoutes(route.children, context) : null;
    return route;
  });
}

export function getComponents<C>(
  path: Path,
  routes: Route<C>[],
  context: C,
): ComponentType<mixed>[] {
  return getRoutePath(path, routes, context)
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
