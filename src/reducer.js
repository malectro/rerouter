// @flow

import type {Path, Location, Query} from './types';
import type {RerouterAction} from './actions';

import {ROUTE} from './actions';
import {createLocation} from './utils';


export type State = {
  history?: History,
  location: Location,
  path: Path,
  params: Query,
};

export default function reduce(
  router: State = {
    location: createLocation(),
    path: [], // match(routes, location.pathname),
    params: {},
  },
  action: RerouterAction,
) {
  if (action.type === ROUTE) {
    return {
      ...router,
      ...action.payload,
    };
  }

  return router;
}
