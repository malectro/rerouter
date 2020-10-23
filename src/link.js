// @flow

import type {RerouterLocation, LocationType} from './types';

import * as React from 'react';

import {useHistory} from './hooks';


export default function Link({
  to,
  className,
  activeClassName,
  onlyActiveOnIndex,
  children,
  ...props
}: {
  to?: LocationType | (RerouterLocation => LocationType) | void | null,
  className?: string,
  activeClassName?: string,
  onlyActiveOnIndex?: boolean,
  onClick?: (SyntheticMouseEvent<HTMLElement>) => mixed,
  children?: React.Node,
  ...
}): React.Node {
  const history = useHistory();
  const {location} = history;

  let href = typeof to === 'function' ? to(location) : to;
  href = typeof href === 'string' ? href : href && href.pathname;

  const isActive = onlyActiveOnIndex ?
    href === location.pathname
    : href && location.pathname.startsWith(href);

  const handleClick = (event: SyntheticMouseEvent<HTMLElement>) => {
    if (props.onClick) {
      props.onClick(event);
    }

    if (event.isDefaultPrevented() || !href) {
      return;
    }

    event.preventDefault();
    history.push(href);
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
