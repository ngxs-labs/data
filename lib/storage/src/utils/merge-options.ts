import { isNotNil } from '@angular-ru/common/utils';
import { MergeOptions, PersistenceProvider, TTL_EXPIRED_STRATEGY } from '@ngxs-labs/data/typings';

import { STORAGE_TTL_DELAY } from '../tokens/storage-ttl-delay';
import { validatePathInProvider } from './validate-path-in-provider';

// eslint-disable-next-line complexity
export function mergeOptions({ option, decodeType, prefix, meta, stateClassRef }: MergeOptions): PersistenceProvider {
    const provider: PersistenceProvider = Object.assign(option, {
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
        stateClassRef: isNotNil(option.stateClassRef) ? option.stateClassRef : stateClassRef,
        skipMigrate: isNotNil(option.skipMigrate) ? option.skipMigrate : false
    });

    return validatePathInProvider(meta, provider);
}
