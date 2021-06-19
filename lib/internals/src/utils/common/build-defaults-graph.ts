import { deepClone, isSimpleObject } from '@angular-ru/common/object';
import { Any, PlainObject } from '@angular-ru/common/typings';
import { checkValueIsEmpty } from '@angular-ru/common/utils';
import { StoreOptions } from '@ngxs/store/src/symbols';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { DataStateClass } from '@ngxs-labs/data/typings';

import { InvalidChildrenException } from '../../exceptions/invalid-children.exception';
import { getStoreOptions } from '../state-context/get-store-options';

export function buildDefaultsGraph(stateClasses: DataStateClass): Any {
    const options: StoreOptions<Any> = getStoreOptions(stateClasses);
    const children: DataStateClass[] = options.children ?? [];
    const prepared: Any = options.defaults === undefined ? {} : options.defaults;
    const currentDefaults: Any = deepClone(prepared);

    if (children.length) {
        if (isSimpleObject(currentDefaults)) {
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
        if (checkValueIsEmpty(childrenOptions.name)) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_NAME_NOT_FOUND);
        }

        const name: string = childrenOptions.name.toString();
        defaults[name] = buildDefaultsGraph(item);

        return defaults;
    }, currentDefaults ?? {});
}
