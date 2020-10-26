// @flow strict

import type {RerouterLocation, LocationType} from './types';

import * as React from 'react';

import {useHistory} from './hooks';
import {resolveLocation, stringifyLocation} from './utils';


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

  const nextLocation = to && resolveLocation(location, to);

  const isActive = (nextLocation && (onlyActiveOnIndex ?
    nextLocation.pathname === location.pathname
    : location.pathname.startsWith(nextLocation.pathname)));

  const handleClick = (event: SyntheticMouseEvent<HTMLElement>) => {
    if (props.onClick) {
      props.onClick(event);
    }

    if (event.isDefaultPrevented() || !nextLocation) {
      return;
    }

    event.preventDefault();
    history.push(nextLocation);
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
      href={nextLocation && stringifyLocation(nextLocation)}
    >
      {children}
    </a>
  );
}
