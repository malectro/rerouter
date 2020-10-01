// @flow

import type {Location, LocationType} from './types';

import * as React from 'react';
import {useDispatch} from 'react-redux';

import {useLocation} from './hooks';
import {push} from './actions';


export default function Link({
  to,
  className,
  activeClassName,
  onlyActiveOnIndex,
  children,
  ...props
}: {
  to: LocationType | (Location => LocationType) | void | null,
  className?: string,
  activeClassName?: string,
  onlyActiveOnIndex?: boolean,
  onClick: (SyntheticMouseEvent<HTMLElement>) => mixed,
  children: React.Node,
}) {
  const dispatch = useDispatch();
  const location = useLocation();

  let href = to;

  if (typeof href === 'function') {
    href = href(location);
  }
  href = typeof href === 'string' ? href : href.pathname;

  const isActive = onlyActiveOnIndex ?
    href === location.pathname :
    location.pathname.startsWith(href);

  const handleClick = (event: SyntheticMouseEvent<HTMLElement>) => {
    if (props.onClick) {
      props.onClick(event);
    }

    if (event.isDefaultPrevented()) {
      return;
    }

    event.preventDefault();
    dispatch(push(href));
  };

  if (!to) {
    return (
      <a {...props} className={className}>
        {children}
      </a>
    );
  }

  return (
    <a
      {...props}
      className={isActive && activeClassName ? activeClassName : className}
      onClick={handleClick}
      href={href}
    >
      {children}
    </a>
  );
}
