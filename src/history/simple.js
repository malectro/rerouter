// @flow

import type {LocationType, LocationArg, RerouterLocation} from '../types';
import type {BaseHistory} from './base';

import {createLocation, resolveLocation} from '../utils';


export default class SimpleHistory implements BaseHistory {
  _stack: {location: LocationType, state: mixed}[];
  _currentStackIndex: number;

  constructor(location: LocationType) {
    this._stack = [{location, state: {}}];
    this._currentStackIndex = 0;
  }

  async push(locationArg: LocationArg): Promise<void> {
    const location = this.resolveLocation(locationArg);
    this._currentStackIndex++;
    this._stack = [
      ...this._stack.slice(0, this._currentStackIndex),
      {location, state: location.state},
    ];
  }

  async replace(locationArg: LocationArg): Promise<void> {
    const location = this.resolveLocation(locationArg);
    this._stack[this._currentStackIndex] = {
      location,
      state: location.state,
    };
  }

  back() {
    if (this._currentStackIndex < 1) {
      console.warn('Attempted to pop() history on a stack of length 1.');
      return;
    }

    this._currentStackIndex--;
  }
  goBack() {
    this.back();
  }

  get location(): RerouterLocation {
    const {location, state} = this._stack[this._currentStackIndex];
    return createLocation(location, state);
  }

  async leave() {
    // TODO (kyle): SimpleHistory should maybe do leavehooks
  }

  addLeaveHook(): () => void {
    return () => {
      // noop
    };
  }
  removeLeaveHook() {
    // noop
  }
  addListener(): () => void {
    return () => {
      // noop
    };
  }

  resolveLocation(
    locationArg: LocationType | ((RerouterLocation) => LocationType),
  ): RerouterLocation {
    return resolveLocation(this.location, locationArg);
  }
}
