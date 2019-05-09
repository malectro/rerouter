// @flow

import type {Route, Path} from './types';

import {match, getParams, getRoutePath, getComponents} from './path';


class Routes<C> {
  original: Route<C>[];
  working: Route<C>[];
  context: C;

  constructor(tree: Route<C>[], context: C) {
    // TODO (kyle): validation
    this.original = tree;
    this.working = tree;
    this.context = context;
  }

  async resolve(pathname: string) {
    const path = await match(this.working, pathname, this.context);
    const params = getParams(path);
    return {path, params};
  }

  getComponents(path: Path) {
    return getComponents(path, this.working, this.context);
  }

  getRoutePath(path: Path) {
    return getRoutePath(path, this.working, this.context);
  }
}

export default Routes;
