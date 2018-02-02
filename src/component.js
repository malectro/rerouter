// @flow

import type {State} from './reducer';

import * as React from 'react';
import {connect} from 'react-redux';


const mapStateToProps = ({router}) => router;

const Router = ({history, location, path, params}: State) => {
  return path.reduce((tree, {route: {component}}) => {
    if (!component) {
      return tree;
    }
    return React.createElement(component, {params}, tree);
  }, null);
};
export default connect(mapStateToProps)(Router);
