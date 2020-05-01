import { isNotNil } from '@ngxs-labs/data/internals';
import { MergeOptions, PersistenceProvider } from '@ngxs-labs/data/typings';

import { validatePathInProvider } from './validate-path-in-provider';

// eslint-disable-next-line complexity
export function mergeOptions({ option, decodeType, prefix, meta }: MergeOptions): PersistenceProvider {
    const provider: PersistenceProvider = {
        ...option,
        ttl: isNotNil(option.ttl) ? option.ttl : -1,
        version: isNotNil(option.version) ? option.version : 1,
        decode: isNotNil(option.decode) ? option.decode : decodeType,
        prefixKey: isNotNil(option.prefixKey) ? option.prefixKey : prefix,
        nullable: isNotNil(option.nullable) ? option.nullable : false,
        fireInit: isNotNil(option.fireInit) ? option.fireInit : true,
        rehydrate: isNotNil(option.rehydrate) ? option.rehydrate : true
    };

    return validatePathInProvider(meta, provider);
}
