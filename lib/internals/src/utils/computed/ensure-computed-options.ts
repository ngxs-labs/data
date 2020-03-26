import { Any, ComputedOptions } from '@ngxs-labs/data/typings';

import { computedKey } from '../common/computed-key';
import { getComputedOptions } from './get-computed-options';

export function ensureComputedOptions(target: Any, key: string | symbol): ComputedOptions {
    const options: ComputedOptions | null = getComputedOptions(target, key);

    if (!options) {
        Object.defineProperties(target, {
            [computedKey(key)]: {
                enumerable: true,
                configurable: true,
                value: {
                    sequenceId: null,
                    value: null
                }
            }
        });
    }

    return getComputedOptions(target, key)!;
}
