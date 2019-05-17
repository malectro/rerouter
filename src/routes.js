// @flow

import type {Route, RouteCollection, Path} from './types';

import {match, mergeRoutes, resolveRoutes, getParams, getRoutePath, getComponents} from './path';


class Routes<C> {
  original: RouteCollection<C>;
  working: Route<C>[];
  context: C;

  constructor(tree: RouteCollection<C>, context: C) {
    // TODO (kyle): validation
    this.original = tree;
    this.working = resolveRoutes(tree, context);
    this.context = context;
  }

  async resolve(pathname: string) {
    this.working = mergeRoutes(
      this.working,
      resolveRoutes(this.original, this.context),
    );

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
