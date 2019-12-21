import { StateClass } from '@ngxs/store/internals';
import { NGXS_DATA_META, NgxsRepositoryMeta } from '../interfaces/external.interface';
import { Any } from '../interfaces/internal.interface';

/**
 * @description
 * don't use !target.hasOwnProperty(NGXS_DATA_META),
 * because you need support access from parent inheritance class
 */
export function ensureRepository<T>(target: StateClass): NgxsRepositoryMeta<T> {
    if (!(target as Any)[NGXS_DATA_META]) {
        Object.defineProperty(target, NGXS_DATA_META, {
            value: {
                stateMeta: null,
                operations: {}
            }
        });
    }

    return getRepository(target);
}

export function getRepository<T>(target: StateClass): NgxsRepositoryMeta<T> {
    return (target as Any)[NGXS_DATA_META];
}
