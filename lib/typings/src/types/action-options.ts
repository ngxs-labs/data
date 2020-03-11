import { ActionOptions } from '@ngxs/store';

/**
 * @publicApi
 */
export interface RepositoryActionOptions extends ActionOptions {
    async?: boolean;
    debounce?: number;
}
