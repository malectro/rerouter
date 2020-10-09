// @flow

import * as React from 'react';

import type {Location} from './types';
import {useHistory} from './hooks';


export function withRouter<C>(
  WrappedComponent: React.ComponentType<C>,
): React.ComponentType<$Diff<C, {location: Location}>> {
  // $FlowFixMe
  return Object.assign(props => {
    const router = useHistory();
    return <WrappedComponent {...props} {...router} />;
  }, WrappedComponent);
}
