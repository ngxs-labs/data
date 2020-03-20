import { NGXS_COMPUTED_OPTION } from '@ngxs-labs/data/tokens';
import { Any, ComputedOptions } from '@ngxs-labs/data/typings';

export function defineComputedOptions(target: Any, options: ComputedOptions): void {
    Object.defineProperties(target, {
        [NGXS_COMPUTED_OPTION]: {
            enumerable: true,
            configurable: true,
            value: options
        }
    });
}
