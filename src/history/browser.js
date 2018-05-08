// @flow

import type {Location as LocationObject, LocationType} from '../types';

import {BaseHistory} from './base';
import {createLocation, stringifyLocation} from '../utils';


export default class BrowserHistory extends BaseHistory {
  _browserHistory: History;
  _browserLocation: Location;

  constructor(browserHistory: History, location: Location) {
    super();
    this._browserHistory = browserHistory;
    this._browserLocation = location;
  }

  push(location: LocationType, state: Object = {}) {
    this._browserHistory.pushState(state, '', stringifyLocation(location));
  }

  replace(location: LocationType, state: Object = {}) {
    this._browserHistory.replaceState(state, '', stringifyLocation(location));
  }

  pop() {
    this._browserHistory.back();
  }

  get location(): LocationObject {
    return createLocation(this._browserLocation);
  }
}
