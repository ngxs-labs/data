import { ActionOptions, ActionType } from '@ngxs/store';

import { Any } from './any';
import { PlainObjectOf } from './plaing-object-of';

/**
 * @publicApi
 */
export type RepositoryActionOptions = ActionOptions;

/**
 * @publicApi
 */
export type ActionEvent = ActionType & { payload: PlainObjectOf<Any> };

export type ActionName = string;
export type PayloadName = string;
export type PayloadKey = ActionName & PayloadName;
export type PayloadMap = Map<PayloadName, number>;
