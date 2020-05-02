import { StorageMeta, TTL_EXPIRED_STRATEGY, TtLCreatorOptions } from '@ngxs-labs/data/typings';

import { parseStorageMeta } from './parse-storage-meta';

export function ttlStrategyHandler(key: string, value: string | null, options: TtLCreatorOptions): void {
    const { provider, engine }: TtLCreatorOptions = options;

    switch (provider.ttlExpiredStrategy) {
        case TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED:
            engine.removeItem(key);
            break;
        case TTL_EXPIRED_STRATEGY.SET_NULL_DATA_AFTER_EXPIRED:
            // eslint-disable-next-line no-case-declarations
            const meta: StorageMeta<unknown> = parseStorageMeta(value);
            meta.data = null;
            engine.setItem(key, JSON.stringify(meta));
            break;
        case TTL_EXPIRED_STRATEGY.DO_NOTHING_AFTER_EXPIRED:
        default:
            break;
    }
}
