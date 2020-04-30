import { Any, DataStateClass } from '@ngxs-labs/data/typings';
import { StoreOptions } from '@ngxs/store/src/symbols';

export function getStoreOptions(stateClass: DataStateClass): StoreOptions<Any> {
  return stateClass['NGXS_OPTIONS_META']! || { name: '' };
}
