// @flow

import type {LocationType, LocationArg, RerouterLocation} from '../types';
import type {BaseHistory} from './base';

import {createLocation} from '../utils';


export default class SimpleHistory implements BaseHistory {
  _stack: {location: LocationType, state: mixed}[];
  _currentStackIndex: number;

  constructor(location: LocationType) {
    this._stack = [{location, state: null}];
    this._currentStackIndex = 0;
  }

  async push(location: LocationArg, state: mixed): Promise<void> {
    this._currentStackIndex++;
    this._stack = [...this._stack.slice(0, this._currentStackIndex), {location: this.resolveLocation(location), state}];
  }

  async replace(location: LocationArg, state: mixed): Promise<void> {
    this._stack[this._currentStackIndex] = {
      location: this.resolveLocation(location),
      state,
    };
  }

  back() {
    if (this._currentStackIndex < 1) {
      console.warn('Attempted to pop() history on a stack of length 1.');
      return;
    }

    this._currentStackIndex--;
  }

  get location(): RerouterLocation {
    return createLocation(this._stack[this._currentStackIndex].location);
  }

  async leave() {
    // TODO (kyle): SimpleHistory should maybe do leavehooks
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
