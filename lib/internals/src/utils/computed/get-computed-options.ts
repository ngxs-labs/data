import { NGXS_COMPUTED_OPTION } from '@ngxs-labs/data/tokens';
import { Any, ComputedOptions } from '@ngxs-labs/data/typings';

export function getComputedOptions(target: Any): ComputedOptions | null {
    return target[NGXS_COMPUTED_OPTION] ?? null;
}
