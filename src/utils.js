// @flow

import type {LocationType, RerouterLocation} from './types';


export function createLocation(
  location: LocationType | Location = defaultLocation,
): RerouterLocation {
  if (typeof location === 'string') {
    // TODO (kyle): parse this as a pathname with a search string
    return {
      ...defaultLocation,
      pathname: location,
    };
  }

  let searchParams;
  if (location instanceof Location) {
    searchParams = new URLSearchParams(location.search);
  } else {
    searchParams = location.searchParams || (location.query && new URLSearchParams(location.query)) || new URLSearchParams(location.search);
  }
  const query = Object.fromEntries(searchParams.entries());
  const search = searchParams.toString();

  return {
    href: location.href,
    pathname: location.pathname,
    search: search ? '?' + search : search,
    searchParams,
    query,
  };
}

const defaultLocation = {
  href: '',
  pathname: '',
  search: '',
  searchParams: new URLSearchParams(''),
  query: {},
};

export function stringifyLocation(location: RerouterLocation): string {
  return location.pathname + location.search;
}
