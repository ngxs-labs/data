import { Any, ComputedOptions } from '@ngxs-labs/data/typings';

import { computedKey } from '../common/computed-key';

export function getComputedOptions(target: Any, key: string | symbol): ComputedOptions | null {
    return target[computedKey(key)] ?? null;
}
