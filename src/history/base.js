// @flow

import type {LocationType, Location} from '../types';


export interface BaseHistory {
  push(location: LocationType, state?: Object): void;
  replace(location: LocationType, state?: Object): void;
  pop(): void;
  get location(): Location;
  leave(): Promise<void>;
}
