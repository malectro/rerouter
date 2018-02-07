// @flow

import type {LocationType} from './types';


export function createLocation(location: LocationType) {
  if (typeof location === 'string') {
    location = {
      pathname: location,
    };
  }
  return location;
}

export function stringifyLocation(location: LocationType) {
  if (typeof location !== 'string') {
    const {pathname = '', query} = location;
    let {search} = location;

    if (query) {
      const keys = Object.keys(query);
      if (keys.length) {
        search = `?${keys.map(key => `${key}=${query[key]}`).join('&')}`;
      }
    }

    location = pathname + (search || '');
  }
  return location;
}
