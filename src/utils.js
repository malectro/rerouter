// @flow

import type {LocationType} from './types';

import {parse, stringify} from 'querystringify';


export function createLocation(
  location: LocationType | Location = {
    href: '',
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

  const searchParams = location.searchParams || new URLSearchParams(location.search);

  return {
    href: location.href,
    pathname: location.pathname,
    search: location.search,
    searchParams,
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
