// @flow

import type {
  LocationType,
  RerouterLocation,
  LeaveHook,
  PopStateListener,
} from '../types';


export interface BaseHistory {
  push(location: LocationType, state?: Object): Promise<void>;
  replace(
    location: LocationType,
    options?: {state?: mixed, silent?: boolean},
  ): Promise<void>;
  pop(): void;
  get location(): RerouterLocation;
  leave(): Promise<void>;
  addListener(PopStateListener): () => void;
  addLeaveHook(LeaveHook): () => void;
}
