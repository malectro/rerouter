// @flow

import type {
  LocationArg,
  RerouterLocation,
  LeaveHook,
  PopStateListener,
} from '../types';


export interface BaseHistory {
  push(location: LocationArg, state?: Object): Promise<void>;
  replace(
    location: LocationArg,
    options?: {state?: mixed, silent?: boolean},
  ): Promise<void>;
  back(): void;
  goBack(): void;
  get location(): RerouterLocation;
  leave(): Promise<void>;
  addListener(PopStateListener): () => void;
  addLeaveHook(LeaveHook): () => void;
}
