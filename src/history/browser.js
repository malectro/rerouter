// @flow

import type {
  RerouterLocation,
  LocationArg,
  LocationType,
  LeaveHook,
  PopStateListener,
} from '../types';
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
  _currentStackIndex: number = 0;

  _leaveHooks: Set<LeaveHook> = new Set();
  _popStateListeners: Set<PopStateListener> = new Set();

  _browserHistory: History;
  _browserLocation: Location;

  _abortingPopState: boolean = false;

  constructor(
    browserHistory: History = window.history,
    location: Location = window.location,
  ) {
    this._browserHistory = browserHistory;
    this._browserLocation = location;
    this._currentStackIndex =
      (browserHistory.state && browserHistory.state.index) || 0;

    if (!browserHistory.state) {
      this._browserHistory.replaceState(this.generateState(), '');
    }

    window.rerouterHistory = this;

    window.addEventListener('popstate', _event => {
      this.handlePopState();
    });

    window.addEventListener('beforeunload', event =>
      this.handleBeforeUnload(event),
    );
  }

  generateState<S>(subState: S): HistoryState<S> {
    return {
      index: this._currentStackIndex,
      subState,
    };
  }

  async push(location: LocationArg, subState: mixed = null): Promise<void> {
    location = this.resolveLocation(location);

    try {
      await this.leave(location);
    } catch (error) {
      if (error instanceof AbortError) {
        return;
      } else {
        throw error;
      }
    }

    this._currentStackIndex++;
    const state = this.generateState(subState);

    this._stack = [
      ...this._stack.slice(0, this._currentStackIndex),
      {location, state},
    ];
    this._browserHistory.pushState(state, '', stringifyLocation(location));

    this.notify();
  }

  async replace(
    location: LocationArg,
    {
      state = null,
      silent,
    }: {
      state?: mixed,
      silent?: boolean,
    } = {},
  ): Promise<void> {
    location = this.resolveLocation(location);

    if (!silent) {
      try {
        await this.leave(location);
      } catch (error) {
        if (error instanceof AbortError) {
          return;
        } else {
          throw error;
        }
      }
    }

    const superState = this.generateState(state);

    this._stack[this._currentStackIndex] = {location, state: superState};
    this._browserHistory.replaceState(state, '', stringifyLocation(location));

    if (!silent) {
      this.notify();
    }
  }

  pop() {
    this._browserHistory.back();
  }
  back() {
    this.pop();
  }

  // TODO (kyle): memoize this
  get location(): RerouterLocation {
    return createLocation(this._browserLocation);
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

  handleBeforeUnload(event: Event & {returnValue?: mixed}) {
    const response = this.leaveSync();
    if (response) {
      event = event || window.event;
      event.preventDefault();
      event.returnValue = response;
    }
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
    if (nextIndex === this._currentStackIndex) {
      return;
    }

    try {
      await this.leave();

      this.notify();
    } catch (error) {
      console.log('got error', error, nextIndex, this._currentStackIndex);
      if (error instanceof AbortError) {
        if (Number.isInteger(nextIndex)) {
          console.log('aborting');
          this._abortingPopState = true;
          this._browserHistory.go(this._currentStackIndex - nextIndex);
        }
      }
    }
  }

  addLeaveHook(leaveHook: LeaveHook): () => void {
    this._leaveHooks.add(leaveHook);
    return () => {
      this.removeLeaveHook(leaveHook);
    };
  }

  removeLeaveHook(leaveHook: LeaveHook) {
    this._leaveHooks.delete(leaveHook);
  }

  leaveSync(): string | void {
    for (const hook of this._leaveHooks) {
      const response = hook();
      if (response) {
        if (typeof response === 'string') {
          return response;
        }
      }
    }
  }

  async leave(location?: RerouterLocation) {
    const nextLocation = location || this.location;
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

  addListener(listener: PopStateListener): () => void {
    this._popStateListeners.add(listener);
    return () => {
      this._popStateListeners.delete(listener);
    };
  }

  removeListener(listener: () => mixed) {
    this._popStateListeners.delete(listener);
  }

  notify() {
    for (const listener of this._popStateListeners) {
      listener();
    }
  }
}
