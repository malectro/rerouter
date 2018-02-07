// @flow

import type {Route, Location, Query} from './types';
import type {RerouterAction} from './actions';

import invariant from 'invariant';

import {PUSH, REPLACE, POP, HANDLE_POP} from './actions';
import {stringifyLocation} from './utils';
import {match, getParams} from './path';


export type State = {
  history?: History,
  location: Location,
  path: {
    route: Route,
    params: Query,
  }[],
  params: Query,
};

export default function reduce(
  {
    routes,
    history,
    location,
  }: {
    routes: Route[],
    history?: History,
    location: Location,
  },
  router: State = {
    history,
    location,
    path: match(routes, location.pathname),
    params: {},
  },
  action: RerouterAction,
) {
  switch (action.type) {
    case PUSH:
      invariant(
        router.history,
        'The rerouter action PUSH was dispatched without an initialized history. It is okay to not initialize history in a server-side context, but rerouter actions should never be dispatched.',
      );
      router.history.pushState({}, '', stringifyLocation(action.payload));
      break;

    case REPLACE:
      invariant(
        router.history,
        'The rerouter action REPLACE was dispatched without an initialized history. It is okay to not initialize history in a server-side context, but rerouter actions should never be dispatched.',
      );
      router.history.replaceState({}, '', stringifyLocation(action.payload));
      break;

    case POP:
      invariant(
        router.history,
        'The rerouter action POP was dispatched without an initialized history. It is okay to not initialize history in a server-side context, but rerouter actions should never be dispatched.',
      );
      router.history.back();
      return router;

    case HANDLE_POP:
      break;

    default:
      return router;
  }

  const path = match(routes, location.pathname);
  const params = getParams(path);

  return {
    ...router,
    params,
    path,
  };
}
