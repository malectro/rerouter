// @flow

import {createContext, type Context} from 'react';
import {BaseHistory} from './history/base';


export const RouterContext: Context<BaseHistory> = createContext();
