// @flow strict

import * as React from 'react';
import {BaseHistory} from './history/base';
import {HistoryContext} from './history-context';


export function RouterProvider({
  history,
  children,
}: {
  history: BaseHistory,
  children: React.Node,
}): React.Node {
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
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
}
