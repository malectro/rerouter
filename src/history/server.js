// @flow

import type {LocationType, Location} from '../types';
import type {BaseHistory} from './base';

import {AbortError} from '../errors';
import {createLocation} from '../utils';


type HandleRedirect = (LocationType) => mixed;

export default class ServerHistory implements BaseHistory {
  handleRedirect: HandleRedirect;
  location: Location;

  constructor(location: LocationType, onRedirect: HandleRedirect) {
    this.location = createLocation(location);
    this.handleRedirect = onRedirect;
  }

  push(location: LocationType, state: mixed) {
    // noop
  }

  replace(location: LocationType, state: mixed) {
    this.handleRedirect(location);
    throw new AbortError('Aborting due to server redirect.');
  }

  pop() {
    // noop
  }

  async leave() {
    // noop
  }

  addLeaveHook() {}
  addListener() {}
}

