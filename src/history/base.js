// @flow

import type {LocationType, RouterLocation, LeaveHook, PopStateListener} from '../types';


export interface BaseHistory {
  push(location: LocationType, state?: Object): void;
  replace(location: LocationType, state?: Object): void;
  pop(): void;
  get location(): RouterLocation;
  leave(): Promise<void>;
  addListener(PopStateListener): () => void;
  addLeaveHook(LeaveHook): () => void;
}
