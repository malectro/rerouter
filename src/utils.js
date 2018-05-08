// @flow

import type {LocationType} from './types';

import {parse, stringify} from 'querystringify';


export function createLocation(
  location: LocationType | Location = {
    pathname: '',
    search: '',
    query: {},
  },
) {
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

export function stringifyLocation(location: LocationType | Location) {
  if (typeof location !== 'string') {
    const {pathname = ''} = location;
    let {search} = location;

    if (location.query) {
      search = stringify(location.query);
    }

    location = pathname + (search ? `?${search}` : '');
  }
  return location;
}
