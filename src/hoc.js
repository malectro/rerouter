// @flow

import * as React from 'react';

import type {Location} from './types';
import {useRouter} from './hooks';


export function withRouter<C>(
  WrappedComponent: React.ComponentType<C>,
): React.ComponentType<$Diff<C, {location: Location}>> {
  // $FlowFixMe
  return Object.assign(props => {
    const router = useRouter();
    return <WrappedComponent {...props} {...router} />;
  }, WrappedComponent);
}
