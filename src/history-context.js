// @flow

import {createContext, type Context} from 'react';
import {BaseHistory} from './history/base';


// $FlowFixMe[incompatible-type] no point in declaring a history object here
export const HistoryContext: Context<{history: BaseHistory}> = createContext();
