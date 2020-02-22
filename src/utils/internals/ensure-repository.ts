import { Any } from '@ngxs-labs/data/internals';
import { StateClassInternal } from '@ngxs/store/src/internal/internals';

import { NgxsRepositoryMeta } from '../../interfaces/external.interface';
import { NGXS_DATA_META } from '../../interfaces/internal.interface';

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

export function getRepository<T>(target: StateClassInternal): NgxsRepositoryMeta<T> {
    return (target as Any)[NGXS_DATA_META];
}
