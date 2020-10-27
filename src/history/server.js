// @flow strict

import type {LocationType, LocationArg, RerouterLocation} from '../types';
import type {BaseHistory} from './base';

// $FlowFixMe[nonstrict-import]
import invariant from 'invariant';
import {AbortError} from '../errors';
import {createServerLocation} from '../utils';


type HandleRedirect = (LocationType) => mixed;

export default class ServerHistory implements BaseHistory {
  handleRedirect: ?HandleRedirect;
  location: RerouterLocation;

  constructor(location?: LocationType, onRedirect?: HandleRedirect) {
    this.location = createServerLocation(location);
    this.handleRedirect = onRedirect;
  }

  async push(_location: LocationArg) {
    // noop
  }

  async replace(location: LocationArg) {
    invariant(this.handleRedirect != null, 'Cannot call `replace` without a redirect handler.');
    // $FlowFixMe[not-a-function] this is definitely defined. invariant not working.
    this.handleRedirect(this.resolveLocation(location));
    throw new AbortError('Aborting due to server redirect.');
  }

  back() {
    // noop
  }
  goBack() {
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
    const location = createServerLocation(
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

