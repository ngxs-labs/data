import { Any, ComputedOptions } from '@ngxs-labs/data/typings';

import { computedKey } from '../common/computed-key';

export function defineComputedOptions(target: Any, key: string | symbol, options: ComputedOptions): void {
    Object.defineProperties(target, {
        [computedKey(key)]: {
            enumerable: true,
            configurable: true,
            value: options
        }
    });
}
