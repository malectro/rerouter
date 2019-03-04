// @flow

import type {Location, LocationType, Dispatch} from './types';

import * as React from 'react';
import {connect} from 'react-redux';

import {push} from './actions';


const mapStateToProps = ({router: {location}}) => ({
  location,
});

class Link extends React.Component<{
  to: LocationType | (Location => LocationType),
  className?: string,
  activeClassName?: string,
  onlyActiveOnIndex?: boolean,
  children: React.Node,
  location: Location,
  dispatch: Dispatch,
}> {
  render() {
    const {
      to,
      className,
      activeClassName,
      onlyActiveOnIndex,
      children,
      location,
      dispatch: _,
      ...props
    } = this.props;
    let href = to;

    if (typeof href === 'function') {
      href = href(location);
    }
    href = typeof href === 'string' ? href : href.pathname;

    const isActive = onlyActiveOnIndex ? location.pathname.startsWith(href) : href === location.pathname;

    return (
      <a
        {...props}
        className={isActive ? activeClassName : className}
        onClick={this.handleClick}
        href={href}
      >
        {children}
      </a>
    );
  }

  _handleClick(event) {
    event.preventDefault();
    this.props.dispatch(push(this.props.to));
  }
  handleClick = this._handleClick.bind(this);
}

export default connect(mapStateToProps)(Link);
