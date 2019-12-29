import { StateClassInternal } from '@ngxs/store/src/internal/internals';
import { StoreOptions } from '@ngxs/store/src/symbols';
import { Any } from '../interfaces/internal.interface';

export function getStoreOptions(stateClass: StateClassInternal): StoreOptions<Any> {
    return stateClass['NGXS_OPTIONS_META']! || {};
}
