import { ActionType } from '@ngxs/store';
import { Any, PlainObjectOf } from '@ngxs-labs/data/internals';

/**
 * @publicApi
 */
export type ActionEvent = ActionType & { payload: PlainObjectOf<Any> };
