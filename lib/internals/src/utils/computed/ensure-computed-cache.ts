import { Any, Fn } from '@angular-ru/common/typings';
import { ComputedCacheMap, ComputedOptions } from '@ngxs-labs/data/typings';

import { computedKey } from '../common/computed-key';
import { getComputedCache } from './get-computed-cache';

export function ensureComputedCache(target: Any): ComputedCacheMap {
    const cache: ComputedCacheMap | null = getComputedCache(target);

    if (!cache) {
        Object.defineProperties(target, {
            [computedKey()]: {
                enumerable: true,
                configurable: true,
                value: new WeakMap<Fn, ComputedOptions>()
            }
        });
    }

    return getComputedCache(target)!;
}
