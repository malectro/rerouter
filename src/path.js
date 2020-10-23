// @flow

import type {SyncPath, SyncRoute, Params} from './types';


export function matchSync(routes: SyncRoute[], pathname: string, parentPathname: string = ''): SyncPath {
  for (const route of routes.filter(Boolean)) {
    const {path, children} = route;

    if (children && children.length > 0) {
      const matchInfo = path ?
        matches(path, pathname)
        : {
          length: 0,
          params: {},
        };

      if (matchInfo) {
        const pathPart = pathname.slice(0, matchInfo.length);
        const trail = matchSync(children, pathname.slice(matchInfo.length), parentPathname + pathPart);

        if (trail && trail.length > 0) {
          trail.unshift({
            part: path,
            //pathname: matchInfo.length > 0 ? pathname : '',
            pathname: pathPart,
            parentPathname,
            route,
            params: matchInfo.params,
          });

          return trail;
        }
      }
    } else if (path != null) {
      const matchInfo = matches(path, pathname);
      if (matchInfo && (!route.exact || matchInfo.length === pathname.length)) {
        return [
          {
            part: path,
            pathname: pathname.slice(0, matchInfo.length),
            parentPathname,
            route,
            params: matchInfo.params,
          },
        ];
      }
    }
  }

  return [];
}

export function matches(routePath: string, pathname: string): {
  length: number,
  params: Params,
} | void {
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

export function pathToRegex(path: string): {
  regex: RegExp,
  params: string[],
} {
  const params = pathToParams(path);
  const string = path.replace(
    /(?:\(([^\)]+)\))|(?::([^\/]+))|(\*)/g,
    (match, optional, param, wildcard) => {
      if (optional) {
        return `(?:${optional})?`;
      } else if (param) {
        return '([^/]+)';
      } else if (wildcard) {
        return '.*';
      }
      return match;
    },
  );
  return {
    regex: new RegExp(`^/?${string}`),
    params,
  };
}

function pathToParams(path: string): string[] {
  const regex = /:([^\/]+)/g;
  let match;
  const params = [];
  while ((match = regex.exec(path))) {
    params.push(match[1]);
  }
  return params;
}

export function resolveSyncPath(path: SyncPath): {pathname: string, params: Params} {
  return {
    pathname: ''.concat(...path.map(step => step.pathname)),
    //pathname: path[0] ? path[0].pathname : '',
    params: Object.assign({}, ...path.map(step => step.params)),
  };
}
