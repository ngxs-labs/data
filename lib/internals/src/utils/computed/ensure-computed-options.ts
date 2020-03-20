import { NGXS_COMPUTED_OPTION } from '@ngxs-labs/data/tokens';
import { Any, ComputedOptions } from '@ngxs-labs/data/typings';

import { getComputedOptions } from './get-computed-options';

export function ensureComputedOptions(target: Any): ComputedOptions {
    const options: ComputedOptions | null = getComputedOptions(target);

    if (!options) {
        Object.defineProperties(target, {
            [NGXS_COMPUTED_OPTION]: {
                enumerable: true,
                configurable: true,
                value: {
                    sequenceId: null,
                    value: null
                }
            }
        });
    }

    return getComputedOptions(target)!;
}
