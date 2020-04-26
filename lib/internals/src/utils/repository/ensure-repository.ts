import { DataStateClass, NgxsRepositoryMeta } from '@ngxs-labs/data/typings';

import { defineDefaultRepositoryMeta } from './define-default-repository-meta';
import { getRepository } from './get-repository';

/**
 * @description
 * don't use !target.hasOwnProperty(NGXS_DATA_META),
 * because you need support access from parent inheritance class
 */
export function ensureRepository(target: DataStateClass): NgxsRepositoryMeta {
    const repository: NgxsRepositoryMeta | null = getRepository(target) ?? null;
    const metaNotFound: boolean = !repository || repository?.stateClass !== target;

    if (metaNotFound) {
        defineDefaultRepositoryMeta(target);
    }

    return getRepository(target);
}
