// @flow

import type {LocationType, Location} from '../types';
import type {BaseHistory} from './base';

import {createLocation} from '../utils';


export default class SimpleHistory implements BaseHistory {
  _stack: {location: LocationType, state: mixed}[];
  _currentStackIndex: number;

  constructor(location: LocationType) {
    this._stack = [{location, state: null}];
    this._currentStackIndex = 0;
  }

  push(location: LocationType, state: mixed) {
    this._currentStackIndex++;
    this._stack = [...this._stack.slice(0, this._currentStackIndex), {location, state}];
  }

  replace(location: LocationType, state: mixed) {
    this._stack[this._currentStackIndex] = {
      location,
      state,
    };
  }

  pop() {
    if (this._currentStackIndex < 1) {
      console.warn('Attempted to pop() history on a stack of length 1.');
      return;
    }

    this._currentStackIndex--;
  }

  get location(): Location {
    return createLocation(this._stack[this._currentStackIndex].location);
  }

  async leave() {
    // TODO (kyle): SimpleHistory should maybe do leavehooks
  }

  addLeaveHook() {}
  addListener() {}
}
