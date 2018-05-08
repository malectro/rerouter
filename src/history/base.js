// @flow

import type {LocationType, Location} from '../types';

import {createLocation} from '../utils';


export class BaseHistory {
  push(location: LocationType, state: Object = {}) {
    methodNotImplemented('push');
  }

  replace(location: LocationType, state: Object = {}) {
    methodNotImplemented('replace');
  }

  pop() {
    methodNotImplemented('pop');
  }

  get location(): Location {
    methodNotImplemented('get location');
    return createLocation();
  }
}

/*
export class Location {
  constructor() {
    baseClassInstantiated('Location');
  }

  toString() {}
}
*/

function methodNotImplemented(methodName) {
  throw new Error(`"${methodName}" is not implemented.`);
}
