import { DecodingType, NgxsRepositoryMeta, PersistenceProvider, ProviderOptions } from '@ngxs-labs/data/typings';

import { NgxsDataStoragePlugin } from '../ngxs-data-storage-plugin.service';
import { DEFAULT_DECODE_TYPE } from '../tokens/storage-decode-type';
import { NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN } from '../tokens/storage-decode-type-token';
import { DEFAULT_KEY_PREFIX } from '../tokens/storage-prefix';
import { NGXS_DATA_STORAGE_PREFIX_TOKEN } from '../tokens/storage-prefix-token';
import { createDefault } from './create-default';
import { mergeOptions } from './merge-options';

export function ensureProviders(meta: NgxsRepositoryMeta, options?: ProviderOptions): PersistenceProvider[] {
    let providers: PersistenceProvider[];
    const prefix: string = NgxsDataStoragePlugin.injector?.get(NGXS_DATA_STORAGE_PREFIX_TOKEN, DEFAULT_KEY_PREFIX)!;
    const decodeType: DecodingType = NgxsDataStoragePlugin.injector?.get(
        NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN,
        DEFAULT_DECODE_TYPE
    )!;

    if (options) {
        const prepared: PersistenceProvider[] = Array.isArray(options) ? options : [options];
        providers = prepared.map(
            (option: PersistenceProvider): PersistenceProvider => mergeOptions({ option, prefix, decodeType, meta })
        );
    } else {
        providers = createDefault(meta, prefix, decodeType);
    }

    return providers;
}
