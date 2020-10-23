// @flow strict

import type {
  LocationArg,
  RerouterLocation,
  LeaveHook,
  PopStateListener,
} from '../types';


export interface BaseHistory {
  push(location: LocationArg, state?: mixed): Promise<void>;
  replace(
    location: LocationArg,
    options?: {state?: mixed, silent?: boolean},
  ): Promise<void>;
  back(): void;
  goBack(): void;
  // $FlowFixMe[unsafe-getters-setters]
  get location(): RerouterLocation;
  leave(): Promise<void>;
  addListener(PopStateListener): () => void;
  addLeaveHook(LeaveHook): () => void;
}
