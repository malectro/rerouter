// @flow strict

import type {LocationType, LocationArg, RerouterLocation} from './types';


export function createLocation(
  location: LocationType | Location = defaultLocation,
  state?: mixed,
): RerouterLocation {
  if (typeof location === 'string') {
    // TODO (kyle): parse this as a pathname with a search string
    return {
      ...defaultLocation,
      pathname: location,
      state,
    };
  }

  let searchParams;
  if (location instanceof Location) {
    searchParams = new URLSearchParams(location.search);
  } else {
    searchParams =
      location.searchParams ||
      (location.query && new URLSearchParams(location.query)) ||
      new URLSearchParams(location.search);
  }
  const query = Object.fromEntries(searchParams.entries());
  const search = searchParams.toString();

  return {
    href: location.href,
    pathname: location.pathname,
    search: search ? '?' + search : search,
    searchParams,
    query,
    hash: location.hash,
    state: state || (location.state && location.state),
  };
}

export function resolveLocation(
  currentLocation: RerouterLocation,
  locationArg: LocationArg,
): RerouterLocation {
  const location = createLocation(
    typeof locationArg === 'function' ?
      locationArg(currentLocation)
      : locationArg,
  );
  if (!location.pathname.startsWith('/')) {
    location.pathname = currentLocation.pathname + '/' + location.pathname;
  }
  return location;
}

const defaultLocation = {
  href: '',
  pathname: '',
  search: '',
  searchParams: new URLSearchParams(''),
  query: {},
  hash: '',
  state: null,
};

export function stringifyLocation(location: RerouterLocation): string {
  return (
    (location.pathname || '') + (location.search || '') + (location.hash || '')
  );
}
