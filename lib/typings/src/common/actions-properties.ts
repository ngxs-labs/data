import { ActionOptions, ActionType } from '@ngxs/store';

import { Any } from './any';
import { PlainObjectOf } from './plaing-object-of';

/**
 * @publicApi
 */
export interface RepositoryActionOptions extends ActionOptions {
    insideZone?: boolean;
}

/**
 * @publicApi
 */
export type ActionEvent = (ActionType & { payload: PlainObjectOf<Any> }) | ActionType;

export type ActionName = string;
export type PayloadName = string;
export type ArgName = string;

export type PayloadMap = Map<number | PayloadName, PayloadName>;
export type ArgNameMap = Map<number | ArgName, ArgName>;
