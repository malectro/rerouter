// @flow

import type {State} from './reducer';

import * as React from 'react';
import {connect} from 'react-redux';

import Routes from './routes';


type Props<E: Object> = {
  routes: Routes,
  // TODO (kyle): this is for backwards compatibility and probably isn't necessary.
  extras: E,
} & State;

const mapStateToProps = ({router}) => router;

const Router = <E: Object>({
  routes,
  location,
  path,
  params,
  extras,
}: Props<E>) => {
  console.log('rendering routes');
  return routes
    .getComponents(path)
    .reduceRight(
      (tree, component) =>
        React.createElement(component, {...extras, location, params}, tree),
      null,
    );
};
export default connect(mapStateToProps)(Router);
