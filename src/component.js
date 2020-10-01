// @flow

import type {State} from './reducer';

import * as React from 'react';

import {useRouter} from './hooks';
import Routes from './routes';


type Props<E: Object> = {
  routes: Routes,
  // TODO (kyle): this is for backwards compatibility and probably isn't necessary.
  extras: E,
} & State;

const mapStateToProps = ({router}) => router;

// TODO (kyle): could catch `ReplaceError` instances in render?
const Router = <E: Object>({
  routes,
  extras,
}: Props<E>) => {
  const {location, path, params} = useRouter();
  console.log('location', location);
  const tree = routes
    .getRoutePath(path)
    .filter(({component}) => component)
    .reduceRight(
      (tree, route) =>
        React.createElement(
          route.component,
          {...extras, route, location, params},
          tree,
        ),
      null,
    );
  console.log('tree', tree);
  return tree;
}
export default Router;
