// @flow strict

import type {LocationType, LocationArg, RerouterLocation} from './types';


export function createLocation(
  locationArg: LocationType | Location = defaultLocation,
  state?: mixed,
): RerouterLocation {
  return createServerLocation(
    locationArg instanceof Location ?
      {
        href: locationArg.href,
        pathname: locationArg.pathname,
        search: locationArg.search,
        hash: locationArg.hash,
      }
      : locationArg,
    state,
  );
}

export function createServerLocation(
  location: LocationType = defaultLocation,
  state?: mixed,
): RerouterLocation {
  if (typeof location === 'string') {
    // TODO (kyle): parse this as a pathname with a search string
    return {
      ...defaultLocation,
      href: location,
      pathname: location,
      state: state || null,
    };
  }

  const searchParams =
    location.searchParams ||
    (location.query && new URLSearchParams(location.query)) ||
    new URLSearchParams(location.search);
  const query = Object.fromEntries(searchParams.entries());
  const searchString = searchParams.toString();
  const search = searchString ? '?' + searchString : searchString;
  const hash = location.hash || '';

  return {
    href: location.pathname + search + hash,
    pathname: location.pathname,
    search,
    searchParams,
    query,
    hash,
    state: state || (location.state && location.state) || null,
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
