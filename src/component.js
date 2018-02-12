// @flow

import type {Route} from './types';
import type {State} from './reducer';

import * as React from 'react';
import {connect} from 'react-redux';

import {getComponents} from './path';


type Props = {
  routes: Route[],
} & State;

const mapStateToProps = ({router}) => router;

const Router = ({routes, location, path, params}: Props) =>
  getComponents(path, routes).reduce(
    (tree, component) =>
      React.createElement(component, {location, params}, tree),
    null,
  );
export default connect(mapStateToProps)(Router);
