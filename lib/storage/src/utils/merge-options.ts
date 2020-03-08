import { isNotNil } from '@ngxs-labs/data/internals';
import { PersistenceProvider } from '@ngxs-labs/data/typings';

import { MergeOptions } from '../typings/symbol';
import { validatePathInProvider } from './validate-path-in-provider';

export function mergeOptions({ option, decodeType, prefix, meta }: MergeOptions): PersistenceProvider {
    const provider: PersistenceProvider = {
        ...option,
        ttl: isNotNil(option.ttl) ? option.ttl : -1,
        version: isNotNil(option.version) ? option.version : 1,
        decode: isNotNil(option.decode) ? option.decode : decodeType,
        prefixKey: isNotNil(option.prefixKey) ? option.prefixKey : prefix,
        nullable: isNotNil(option.nullable) ? option.nullable : false
    };

    return validatePathInProvider(meta, provider);
}
