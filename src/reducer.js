import {PUSH, REPLACE, POP, HANDLE_POP} from './actions';


export default function reduce({routes, history, location}, router = {
  history,
  location,
  path: match(routes, location.pathname),
}, action) {
  switch (action.type) {
    case PUSH:
      router.history.pushState({}, null, massageLocation(action.payload));
      break;

    case REPLACE:
      router.history.replaceState({}, null, massageLocation(action.payload));
      break;

    case POP:
      router.history.back();
      return router;

    case HANDLE_POP:
      break;

    default:
      return router;
  }

  const path = match(routes, location.pathname);
  const params = path.reduce((allParams, {params}) => ({...allParams, ...params}));

  return {
    ...router,
    params,
    path,
  };
}


function massageLocation(location) {
  if (typeof location !== 'string') {
    let {pathname = '', query, search} = location;

    if (query) {
      const keys = Object.keys(query);
      if (keys.length) {
        search = `?${keys.map(key => `${key}=${query[key]}`).join('&')}`;
      }
    }

    location = pathname + search;
  }
  return location
}

export function match(routes, pathname) {
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
        matchInfo = matches(route.path, pathname);
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
    } else {
      const matchInfo = matches(route.path, pathname);
      if (matchInfo && matchInfo.length === pathname.length) {
        return [{
          route,
          params: matchInfo.params,
        }];
      }
    }
  }
}

function matches(routePath, pathname) {
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

function pathToRegex(path) {
  const params = /:([^\/]+)/g.exec(path);
  const string = path.replace(/:([^\/]+)/g, '([^/]+)').replace('*', '[^/]*');
  return {
    regex: new RegExp(`^/?${string}`),
    params,
  };
}
