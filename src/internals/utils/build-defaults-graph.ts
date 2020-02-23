import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/common';
import { PlainObject, StateClass } from '@ngxs/store/internals';
import { StateClassInternal } from '@ngxs/store/src/internal/internals';
import { StoreOptions } from '@ngxs/store/src/symbols';

import { Any } from '../types/symbols';
import { deepCloneDefaults } from './deep-close-defaults';
import { getStoreOptions } from './get-store-options';
import { isPlainObject } from './is-plain-object';

export function buildDefaultsGraph(stateClasses: StateClassInternal): Any {
    const options: StoreOptions<Any> = getStoreOptions(stateClasses);
    const children: StateClass[] = options.children || [];
    const currentDefaults: Any = deepCloneDefaults(options.defaults);

    if (children.length) {
        if (isPlainObject(currentDefaults)) {
            return children.reduce((defaults: PlainObject, item: StateClassInternal) => {
                const childrenOptions: StoreOptions<Any> = getStoreOptions(item);
                if (!childrenOptions.name) {
                    throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_NAME_NOT_FOUND);
                }

                const name: string = childrenOptions.name.toString();
                defaults[name] = buildDefaultsGraph(item);

                return defaults;
            }, currentDefaults);
        } else {
            throw new Error(
                `${NGXS_DATA_EXCEPTIONS.NGXS_DATA_CHILDREN_CONVERT}. Cannot convert ${
                    currentDefaults && currentDefaults.constructor ? currentDefaults.constructor.name : currentDefaults
                } to PlainObject`
            );
        }
    } else {
        return currentDefaults;
    }
}
