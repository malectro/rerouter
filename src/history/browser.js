// @flow

import type {Location as LocationObject, LocationType, LeaveHook, PopStateListener} from '../types';
import type {BaseHistory} from './base';

import {AbortError} from '../errors';
import {createLocation, stringifyLocation} from '../utils';


type HistoryState<S> = {
  index: number,
  subState: S,
};

// decide whether or not to keep the virtual stack in history or in the middleware
//
// we should prevent transitions by resetting the browserHistory stack to
// the previous position.

export default class BrowserHistory implements BaseHistory {
  // TODO (kyle): not sure it is necessary to keep a secondary stack
  _stack: {location: LocationType, state: HistoryState<mixed>}[] = [];
  _currentStackIndex = 0;

  _leaveHooks: Set<LeaveHook> = new Set();
  _popStateListeners: Set<PopStateListener> = new Set();

  _browserHistory: History;
  _browserLocation: Location;

  _abortingPopState = false;

  constructor(browserHistory: History, location: Location) {
    this._browserHistory = browserHistory;
    this._browserLocation = location;
    this._currentStackIndex = (browserHistory.state && browserHistory.state.index) || 0;

    if (!browserHistory.state) {
      this._browserHistory.replaceState(
        this.generateState(),
        '',
      );
    }

    window.rerouterHistory = this;

    window.addEventListener('popstate', () => {
      this.handlePopState();
    });
  }

  generateState<S>(subState: S): HistoryState<S> {
    return {
      index: this._currentStackIndex,
      subState,
    };
  }

  push(location: LocationType, subState: mixed = null) {
    this._currentStackIndex++;
    const state = this.generateState(subState);

    this._stack = [...this._stack.slice(0, this._currentStackIndex), {location, state}];
    this._browserHistory.pushState(state, '', stringifyLocation(location));
  }

  replace(location: LocationType, subState: mixed = null) {
    const state = this.generateState(subState);

    this._stack[this._currentStackIndex] = {location, state};
    this._browserHistory.replaceState(state, '', stringifyLocation(location));
  }

  pop() {
    this._browserHistory.back();
  }

  get location(): LocationObject {
    return createLocation(this._browserLocation);
  }

  async handlePopState() {
    // if this event was triggered by an aborted transition, we ignore it.
    if (this._abortingPopState) {
      this._abortingPopState = false;
      return;
    }

    const nextIndex = (this._browserHistory.state || {}).index;

    // if the nextIndex matches the currentIndex it means this
    // pop event was due to an Abort from a previous pop.
    if (nextIndex === this._currentIndex) {
      return;
    }

    try {
      console.log('history leaving');
      await this.leave();

      for (const listener of this._popStateListeners) {
        listener();
      }
    } catch (error) {
      if (error instanceof AbortError) {
        console.log('routing aborted');

        if (Number.isInteger(nextIndex)) {
          console.log('going', nextIndex, nextIndex - this._currentStackIndex);
          this._abortingPopState = true;
          this._browserHistory.go(this._currentStackIndex - nextIndex);
        }
      }
    }
  }

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
    const nextLocation = this.location;
    console.log('leaving', this._leaveHooks);
    for (const hook of this._leaveHooks) {
      const response = hook(nextLocation);
      console.log('response', response);
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

  addPopStateListener(listener: PopStateListener) {
    this._popStateListeners.add(listener);
    return () => {
      this._popStateListeners.delete(listener);
    };
  }

  removePopStateListener(listener: () => mixed) {
    this._popStateListeners.delete(listener);
  }
}
