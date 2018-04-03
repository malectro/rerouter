// @flow

import type {State} from './reducer';

import * as React from 'react';
import {connect} from 'react-redux';

import Routes from './routes';


type Props = {
  routes: Routes,
} & State;

const mapStateToProps = ({router}) => router;

const Router = ({routes, location, path, params}: Props) => routes
  .getComponents(path)
  .reduceRight(
    (tree, component) =>
      React.createElement(component, {location, params}, tree),
    null,
  );
export default connect(mapStateToProps)(Router);
