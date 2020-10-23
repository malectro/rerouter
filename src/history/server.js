// @flow

import type {LocationType, RerouterLocation} from '../types';
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

  async push(_location: LocationType) {
    // noop
  }

  async replace(location: LocationType) {
    this.handleRedirect(location);
    throw new AbortError('Aborting due to server redirect.');
  }

  pop() {
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
}

