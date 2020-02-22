import { MetaDataModel, StateClassInternal } from '@ngxs/store/src/internal/internals';
import { META_KEY } from './meta-key';
import { Any } from '../../internals/types/symbols';

export function getStateMetadata(target: StateClassInternal): MetaDataModel {
    return (target as Any)[META_KEY]!;
}
