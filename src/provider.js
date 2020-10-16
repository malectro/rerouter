// @flow

import * as React from 'react';
import {BaseHistory} from './history/base';
import {RouterContext} from './history-context';


export function RouterProvider({
  history,
  children,
}: {
  history: BaseHistory,
  children: React.ReactNode,
}) {
  const [_, setState] = React.useState();

  React.useEffect(
    () =>
      history.addListener(() => {
        console.log('location change event');
        setState({});
      }),
    [history],
  );

  const contextValue = React.useMemo(() => ({history}), [
    history.location.href,
  ]);

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}
