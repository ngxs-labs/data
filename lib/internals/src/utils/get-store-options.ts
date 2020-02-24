import { Any } from '@ngxs-labs/data/typings';
import { StateClassInternal } from '@ngxs/store/src/internal/internals';
import { StoreOptions } from '@ngxs/store/src/symbols';

export function getStoreOptions(stateClass: StateClassInternal): StoreOptions<Any> {
    return stateClass['NGXS_OPTIONS_META']! || {};
}
