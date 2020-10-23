// @flow strict

import type {LocationType} from './types';

// NOTE (kyle): we don't extend Error until it is fully supported by our target
// environment (browsers, babel).

export class RouterError {}

export class AbortError extends RouterError {
  reason: string;
  constructor(reason: string) {
    super();
    this.reason = reason;
  }
}

export class ReplaceError extends RouterError {
  location: LocationType;
  constructor(location: LocationType) {
    super();
    this.location = location;
  }
}
