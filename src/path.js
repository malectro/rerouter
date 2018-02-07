// @flow

import type {Route, Path} from './types';


export function match(routes: Route[], pathname: string) {
  for (const route of routes) {
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
        return [
          {
            route,
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

export function getComponents(path: Path) {
  return path
    .map(({route: {component}}) => component)
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
