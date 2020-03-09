import { NgxsRepositoryMeta } from '@ngxs-labs/data/typings';
import { StateClassInternal } from '@ngxs/store/src/internal/internals';

import { defineDefaultRepositoryMeta } from './define-default-repository-meta';
import { getRepository } from './get-repository';

/**
 * @description
 * don't use !target.hasOwnProperty(NGXS_DATA_META),
 * because you need support access from parent inheritance class
 */
export function ensureRepository<T>(target: StateClassInternal): NgxsRepositoryMeta<T> {
    const repository: NgxsRepositoryMeta<T> | null = getRepository(target) ?? null;
    const metaNotFound: boolean = !repository || repository?.stateClass !== target;

    if (metaNotFound) {
        defineDefaultRepositoryMeta(target);
    }

    return getRepository(target);
}
