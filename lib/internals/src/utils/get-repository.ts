import { NGXS_DATA_META } from '@ngxs-labs/data/tokens';
import { Any, NgxsRepositoryMeta } from '@ngxs-labs/data/typings';
import { StateClassInternal } from '@ngxs/store/src/internal/internals';

export function getRepository<T>(target: StateClassInternal): NgxsRepositoryMeta<T> {
    return (target as Any)[NGXS_DATA_META];
}
