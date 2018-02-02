// @flow

import type {State} from './reducer';

import * as React from 'react';
import {connect} from 'react-redux';


const mapStateToProps = ({router}) => router;

const Router = ({location, path, params}: State) =>
  path.reduce((tree, {route: {component}}) => {
    if (!component) {
      return tree;
    }
    return React.createElement(component, {location, params}, tree);
  }, null);
export default connect(mapStateToProps)(Router);
