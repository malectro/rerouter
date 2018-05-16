// @flow

import type {Location as LocationObject, LocationType} from '../types';
import type {BaseHistory} from './base';

import {AbortError} from '../errors';
import {createLocation, stringifyLocation} from '../utils';


type LeaveHook = (
  nextLocation: LocationObject,
) => void | string | Promise<void>;

export default class BrowserHistory implements BaseHistory {
  _browserHistory: History;
  _browserLocation: Location;
  _leaveHooks: Set<LeaveHook>;
  _popStateListeners: Set<() => any>;

  constructor(browserHistory: History, location: Location) {
    super();
    this._browserHistory = browserHistory;
    this._browserLocation = location;
    this._leaveHooks = new Set();
    this._popStateListeners = new Set();

    window.addEventListener('popstate', () => {
      this.handlePopState();
    });
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

  handlePopState() {}

  addLeaveHook(leaveHook: LeaveHook) {
    this._leaveHooks.add(leaveHook);
    return () => {
      this.removeLeaveHook(leaveHook);
    };
  }

  removeLeaveHook(leaveHook: LeaveHook) {
    this._leaveHooks.delete(leaveHook);
  }

  async leave() {
    for (const hook of this._leaveHooks) {
      const response = hook(nextLocation);
      if (response) {
        if (typeof response === 'string') {
          // eslint-disable-next-line no-alert
          if (!confirm(response)) {
            throw new AbortError('User rejected navigation.');
          }
        } else {
          await response;
        }
      }
    }
  }
}
