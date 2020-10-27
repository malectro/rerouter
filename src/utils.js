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
    (location.query && new URLSearchParams(location.query)) ||
    location.searchParams ||
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
  let resolvedLocationArg = typeof locationArg === 'function' ?
      locationArg(currentLocation)
      : locationArg;

  // TODO (kyle): maybe find a more efficient way to handle this?
  // NOTE (kyle): because we allow all 3 of these possibly conflicting properties,
  // we have to determine developer intent by checking which of them have changed.
  if (typeof resolvedLocationArg === 'object') {
    const {query, search, searchParams, ...rest} = resolvedLocationArg;
    if (query && query !== currentLocation.query) {
      resolvedLocationArg = {
        ...rest,
        query,
      };
    } else if (searchParams && searchParams !== currentLocation.searchParams) {
      resolvedLocationArg = {
        ...rest,
        searchParams,
      };
    } else if (search && search !== currentLocation.search) {
      resolvedLocationArg = {
        ...rest,
        search,
      };
    }
  }

  const location = createLocation(
    resolvedLocationArg
  );
  /*
  const location = createLocation(
    typeof locationArg === 'function' ?
      locationArg(currentLocation)
      : locationArg,
  );
  */
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
