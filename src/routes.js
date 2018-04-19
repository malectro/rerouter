// @flow

import type {Route, PathNode, Path} from './types';

import {match, getParams, getRoutePath, getComponents} from './path';


class Routes {
  original: Route[];
  working: Route[];

  constructor(tree: Route[]) {
    // TODO (kyle): validation
    this.original = tree;
    this.working = tree;
  }

  async resolve(pathname: string) {
    const path = await match(this.working, pathname);
    const params = getParams(path);
    return {path, params};
  }

  getComponents(path: Path) {
    return getComponents(path, this.working);
  }

  getRoutePath(path: Path) {
    return getRoutePath(path, this.working);
  }
}

export default Routes;
