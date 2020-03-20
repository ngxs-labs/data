import { NGXS_DATA_META } from '@ngxs-labs/data/tokens';
import { DataStateClass, NgxsRepositoryMeta } from '@ngxs-labs/data/typings';

export function getRepository<T>(target: DataStateClass): NgxsRepositoryMeta {
    return target[NGXS_DATA_META]!;
}
