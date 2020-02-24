import { NGXS_DATA_META } from '@ngxs-labs/data/tokens';
import { Any, NgxsRepositoryMeta } from '@ngxs-labs/data/typings';
import { StateClassInternal } from '@ngxs/store/src/internal/internals';

import { getRepository } from './get-repository';

/**
 * @description
 * don't use !target.hasOwnProperty(NGXS_DATA_META),
 * because you need support access from parent inheritance class
 */
export function ensureRepository<T>(target: StateClassInternal): NgxsRepositoryMeta<T> {
    if (!(target as Any)[NGXS_DATA_META]) {
        Object.defineProperty(target, NGXS_DATA_META, {
            value: { stateMeta: null, operations: {} }
        });
    }

    return getRepository(target);
}
