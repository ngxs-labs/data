import { CreateStorageDefaultOptions, PersistenceProvider, TTL_EXPIRED_STRATEGY } from '@ngxs-labs/data/typings';

import { STORAGE_TTL_DELAY } from '../tokens/storage-ttl-delay';

// eslint-disable-next-line max-lines-per-function
export function createDefault(options: CreateStorageDefaultOptions): PersistenceProvider[] {
    const { meta, decodeType, prefix, stateInstance }: CreateStorageDefaultOptions = options;

    return [
        {
            get path(): string | null | undefined {
                return meta.stateMeta && meta.stateMeta.path;
            },
            existingEngine: localStorage,
            ttl: -1,
            version: 1,
            decode: decodeType,
            prefixKey: prefix,
            nullable: false,
            fireInit: true,
            rehydrate: true,
            ttlDelay: STORAGE_TTL_DELAY,
            ttlExpiredStrategy: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
            stateInstance
        }
    ] as PersistenceProvider[];
}
