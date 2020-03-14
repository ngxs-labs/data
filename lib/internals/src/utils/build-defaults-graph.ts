import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { Any, DataStateClass } from '@ngxs-labs/data/typings';
import { PlainObject } from '@ngxs/store/internals';
import { StoreOptions } from '@ngxs/store/src/symbols';

import { InvalidChildrenException } from '../exceptions/invalid-children.exception';
import { deepCloneDefaults } from './deep-close-defaults';
import { getStoreOptions } from './get-store-options';
import { isPlainObject } from './is-plain-object';

export function buildDefaultsGraph(stateClasses: DataStateClass): Any {
    const options: StoreOptions<Any> = getStoreOptions(stateClasses);
    const children: DataStateClass[] = options.children || [];
    const currentDefaults: Any = deepCloneDefaults(options.defaults);

    if (children.length) {
        if (isPlainObject(currentDefaults)) {
            return buildChildrenGraph(currentDefaults, children);
        } else {
            throw new InvalidChildrenException(currentDefaults);
        }
    } else {
        return currentDefaults;
    }
}

function buildChildrenGraph(currentDefaults: Any, children: DataStateClass[]): Any {
    return children.reduce((defaults: PlainObject, item: DataStateClass): PlainObject => {
        const childrenOptions: StoreOptions<Any> = getStoreOptions(item);
        if (!childrenOptions.name) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_NAME_NOT_FOUND);
        }

        const name: string = childrenOptions.name.toString();
        defaults[name] = buildDefaultsGraph(item);

        return defaults;
    }, currentDefaults);
}
