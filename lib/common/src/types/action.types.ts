import { Any, PlainObjectOf } from '@ngxs-labs/data/internals';
import { ActionOptions, ActionType } from '@ngxs/store';

/**
 * @publicApi
 */
export type ActionEvent = ActionType & { payload: PlainObjectOf<Any> };

/**
 * @publicApi
 */
export interface RepositoryActionOptions extends ActionOptions {
    type?: string | null;
    async?: boolean;
    debounce?: number;
}
