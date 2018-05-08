// @flow

import type {LocationType, Location} from '../types';

import {BaseHistory} from './base';
import {createLocation} from '../utils';


export default class SimpleHistory extends BaseHistory {
  location: Location;
  _stack: {location: Location, state: Object}[];

  constructor(location: LocationType) {
    super();
    this.location = createLocation(location);
    this._stack = [{location: this.location, state: {}}];
  }

  push(location: LocationType, state: Object = {}) {
    this.location = createLocation(location);
    this._stack.push({
      location: this.location,
      state,
    });
  }

  replace(location: LocationType, state: Object = {}) {
    this.location = createLocation(location);
    this._stack[this._stack.length - 1] = {
      location: this.location,
      state,
    };
  }

  pop() {
    if (this._stack.length < 2) {
      console.warn('Attempted to pop() history on a stack of length 1.');
      return;
    }

    this._stack.pop();
    this.location = this._stack[this._stack.length - 1].location;
  }
}
