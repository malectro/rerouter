// @flow

import type {LocationType} from './types';

import {parse, stringify} from 'querystringify';


export function createLocation(location: LocationType) {
  if (typeof location === 'string') {
    return {
      pathname: location,
    };
  }

  return {
    pathname: location.pathname,
    search: location.search,
    query: location.query || parse(location.search || ''),
  };
}

export function stringifyLocation(location: LocationType) {
  if (typeof location !== 'string') {
    const {pathname = '', query} = location;
    let {search} = location;

    if (query) {
      search = stringify(query);
    }

    location = pathname + (search || '');
  }
  return location;
}
