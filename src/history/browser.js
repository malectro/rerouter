// @flow strict

import type {
  RerouterLocation,
  LocationArg,
  LocationType,
  LeaveHook,
  PopStateListener,
} from '../types';
import type {BaseHistory} from './base';

import {AbortError} from '../errors';
import {createLocation, resolveLocation, stringifyLocation} from '../utils';


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

  _location: RerouterLocation;

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

    this.updateLocation();

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

  async push(locationArg: LocationArg): Promise<void> {
    const location = this.resolveLocation(locationArg);

    console.log('pushing', locationArg, location, stringifyLocation(location));

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
    const state = this.generateState(location.state);

    this._stack = [
      ...this._stack.slice(0, this._currentStackIndex),
      {location, state},
    ];
    this._browserHistory.pushState(state, '', stringifyLocation(location));

    this.updateLocation();
    this.notify();
  }

  async replace(
    locationArg: LocationArg,
    {
      silent,
    }: {
      silent?: boolean,
    } = {},
  ): Promise<void> {
    const location = this.resolveLocation(locationArg);

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

    const state = this.generateState(location.state);

    this._stack[this._currentStackIndex] = {location, state};
    this._browserHistory.replaceState(state, '', stringifyLocation(location));

    this.updateLocation();

    if (!silent) {
      this.notify();
    }
  }

  pop() {
    this.back();
  }
  back() {
    this._browserHistory.back();
  }
  goBack() {
    this.back();
  }

  updateLocation() {
    this._location = createLocation(
      this._browserLocation,
      this._browserHistory.state.subState,
    );
  }

  // $FlowFixMe[unsafe-getters-setters]
  get location(): RerouterLocation {
    return this._location;
  }

  resolveLocation(
    locationArg: LocationType | (RerouterLocation => LocationType),
  ): RerouterLocation {
    return resolveLocation(this.location, locationArg);
  }

  handleBeforeUnload(event: Event & {returnValue?: mixed} = window.event) {
    const response = this.leaveSync();
    if (response) {
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
      this.updateLocation();
      await this.leave();
      this.notify();
    } catch (error) {
      if (error instanceof AbortError) {
        if (Number.isInteger(nextIndex)) {
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
