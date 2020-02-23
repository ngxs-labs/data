import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/common';
import { Any } from '@ngxs-labs/data/internals';
import { PlainObject, StateClass } from '@ngxs/store/internals';
import { StateClassInternal } from '@ngxs/store/src/internal/internals';
import { StoreOptions } from '@ngxs/store/src/symbols';

/**
 * Default clone NGXS
 *  private static cloneDefaults(defaults: any): any {
    let value = {};

    if (Array.isArray(defaults)) {
      value = defaults.slice();
    } else if (isObject(defaults)) {
      value = { ...defaults };
    } else if (defaults === undefined) {
      value = {};
    } else {
      value = defaults;
    }

    return value;
  }
 * @param value
 */
export function deepCloneDefaults(value: Any): Any {
    const prepared: Any = value === undefined ? {} : value;
    return JSON.parse(JSON.stringify(prepared));
}

function isPlainObject(item: Any): boolean {
    return typeof item === 'object' && !Array.isArray(item) && item !== null;
}

export function buildDefaultsGraph(stateClasses: StateClassInternal): Any {
    const options: StoreOptions<Any> = stateClasses['NGXS_OPTIONS_META']! || {};
    const children: StateClass[] = options.children || [];
    const currentDefaults: Any = deepCloneDefaults(options.defaults);

    if (children.length) {
        if (isPlainObject(currentDefaults)) {
            return children.reduce((defaults: PlainObject, item: StateClassInternal) => {
                const childrenOptions: StoreOptions<Any> = item['NGXS_OPTIONS_META']! || {};
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
