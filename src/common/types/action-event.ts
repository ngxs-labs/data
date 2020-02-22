import { Any, PlainObjectOf } from '@ngxs-labs/data/internals';
import { ActionType } from '@ngxs/store';

/**
 * @publicApi
 */
export type ActionEvent = ActionType & { payload: PlainObjectOf<Any> };
