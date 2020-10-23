// @flow

import type {LocationType, LocationArg, RerouterLocation} from '../types';
import type {BaseHistory} from './base';

import {AbortError} from '../errors';
import {createLocation} from '../utils';


type HandleRedirect = (LocationType) => mixed;

export default class ServerHistory implements BaseHistory {
  handleRedirect: HandleRedirect;
  location: RerouterLocation;

  constructor(location: LocationType, onRedirect: HandleRedirect) {
    this.location = createLocation(location);
    this.handleRedirect = onRedirect;
  }

  async push(_location: LocationArg) {
    // noop
  }

  async replace(location: LocationArg) {
    this.handleRedirect(this.resolveLocation(location));
    throw new AbortError('Aborting due to server redirect.');
  }

  back() {
    // noop
  }

  async leave() {
    // noop
  }

  addLeaveHook(): () => void {
    return () => {
      // noop
    };
  }
  addListener(): () => void {
    return () => {
      // noop
    };
  }

  resolveLocation(
    locationArg: LocationType | (RerouterLocation => LocationType),
  ): RerouterLocation {
    const location = createLocation(
      typeof locationArg === 'function' ?
        locationArg(this.location)
        : locationArg,
    );
    if (!location.pathname.startsWith('/')) {
      location.pathname = this.location.pathname + '/' + location.pathname;
    }
    return location;
  }
}

