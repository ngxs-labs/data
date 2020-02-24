import { ActionOptions } from '@ngxs/store';

/**
 * @publicApi
 */
export interface RepositoryActionOptions extends ActionOptions {
    type?: string | null;
    async?: boolean;
    debounce?: number;
}
