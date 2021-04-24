import { Any } from '@angular-ru/common/typings';
import { StoreOptions } from '@ngxs/store/src/symbols';
import { DataStateClass } from '@ngxs-labs/data/typings';

export function getStoreOptions(stateClass: DataStateClass): StoreOptions<Any> {
    return stateClass['NGXS_OPTIONS_META']! || { name: '' };
}
