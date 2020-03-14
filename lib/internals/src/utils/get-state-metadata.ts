import { NGXS_META_KEY } from '@ngxs-labs/data/tokens';
import { DataStateClass } from '@ngxs-labs/data/typings';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';

export function getStateMetadata(target: DataStateClass): MetaDataModel {
    return target[NGXS_META_KEY]!;
}
