import { NGXS_META_KEY } from '@ngxs-labs/data/tokens';
import { Any } from '@ngxs-labs/data/typings';
import { MetaDataModel, StateClassInternal } from '@ngxs/store/src/internal/internals';

export function getStateMetadata(target: StateClassInternal): MetaDataModel {
    return (target as Any)[NGXS_META_KEY];
}
