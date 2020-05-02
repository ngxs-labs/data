import { isNotNil } from '@ngxs-labs/data/internals';
import { MergeOptions, PersistenceProvider, TTL_EXPIRED_STRATEGY } from '@ngxs-labs/data/typings';

import { STORAGE_TTL_DELAY } from '../tokens/storage-ttl-delay';
import { validatePathInProvider } from './validate-path-in-provider';

// eslint-disable-next-line complexity
export function mergeOptions({ option, decodeType, prefix, meta, stateInstance }: MergeOptions): PersistenceProvider {
    const provider: PersistenceProvider = {
        ...option,
        ttl: isNotNil(option.ttl) ? option.ttl : -1,
        version: isNotNil(option.version) ? option.version : 1,
        decode: isNotNil(option.decode) ? option.decode : decodeType,
        prefixKey: isNotNil(option.prefixKey) ? option.prefixKey : prefix,
        nullable: isNotNil(option.nullable) ? option.nullable : false,
        fireInit: isNotNil(option.fireInit) ? option.fireInit : true,
        rehydrate: isNotNil(option.rehydrate) ? option.rehydrate : true,
        ttlDelay: isNotNil(option.ttlDelay) ? option.ttlDelay : STORAGE_TTL_DELAY,
        ttlExpiredStrategy: isNotNil(option.ttlExpiredStrategy)
            ? option.ttlExpiredStrategy
            : TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
        stateInstance: isNotNil(option.stateInstance) ? option.stateInstance : stateInstance
    };

    return validatePathInProvider(meta, provider);
}
