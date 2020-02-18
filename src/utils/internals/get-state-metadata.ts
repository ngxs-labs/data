import { MetaDataModel, StateClassInternal } from '@ngxs/store/src/internal/internals';
import { META_KEY } from './meta-key';
import { Any } from '../../interfaces/internal.interface';

export function getStateMetadata(target: StateClassInternal): MetaDataModel {
    return (target as Any)[META_KEY]!;
}
