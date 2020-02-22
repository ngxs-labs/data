import { MetaDataModel, StateClassInternal } from '@ngxs/store/src/internal/internals';

import { Any } from '../../internals/types/symbols';
import { META_KEY } from './meta-key';

export function getStateMetadata(target: StateClassInternal): MetaDataModel {
    return (target as Any)[META_KEY]!;
}
