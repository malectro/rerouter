// @flow

import type {LocationType, Dispatch} from './types';

import * as React from 'react';
import {connect} from 'react-redux';

import {push} from './actions';


class Link extends React.Component<{
  to: LocationType,
  children: React.Node,
  dispatch: Dispatch,
}> {
  render() {
    const {to, children, ...props} = this.props;
    const href = typeof to === 'string' ? to : to.pathname;
    return (
      <a {...props} onClick={this.handleClick} href={href}>{children}</a>
    );
  }

  _handleClick(event) {
    event.preventDefault();
    this.props.dispatch(push(this.props.to));
  }
  handleClick = this._handleClick.bind(this);
}

export default connect()(Link);
