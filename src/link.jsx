// @flow

import type {Location, LocationType, Dispatch} from './types';

import * as React from 'react';
import {connect} from 'react-redux';

import {push} from './actions';


const mapStateToProps = ({router: {location}}) => ({
  location,
});

class Link extends React.Component<{
  to: LocationType | (Location => LocationType) | void | null,
  className?: string,
  activeClassName?: string,
  onlyActiveOnIndex?: boolean,
  onClick: (SyntheticMouseEvent<HTMLElement>) => mixed,
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

    if (!to) {
      return <a {...props} className={className}>{children}</a>;
    }

    let href = to;

    if (typeof href === 'function') {
      href = href(location);
    }
    href = typeof href === 'string' ? href : href.pathname;

    const isActive = onlyActiveOnIndex ? location.pathname.startsWith(href) : href === location.pathname;

    return (
      <a
        {...props}
        className={isActive && activeClassName ? activeClassName : className}
        onClick={this.handleClick}
        href={href}
      >
        {children}
      </a>
    );
  }

  _handleClick(event: SyntheticMouseEvent<HTMLElement>) {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (event.isDefaultPrevented()) {
      return;
    }

    event.preventDefault();
    this.props.dispatch(push(this.props.to));
  }
  handleClick = this._handleClick.bind(this);
}

export default connect(mapStateToProps)(Link);
