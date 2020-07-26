import { Any } from '@angular-ru/common/typings';
import { ComputedCacheMap } from '@ngxs-labs/data/typings';

import { computedKey } from '../common/computed-key';

export function getComputedCache(target: Any): ComputedCacheMap | null {
    return target[computedKey()] ?? null;
}
