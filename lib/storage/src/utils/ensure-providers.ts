import { NgxsRepositoryMeta, PersistenceProvider, ProviderOptions, STORAGE_DECODE_TYPE } from '@ngxs-labs/data/typings';
import { StateClass } from '@ngxs/store/internals';

import { NgxsDataStoragePlugin } from '../ngxs-data-storage-plugin.service';
import { NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN } from '../tokens/storage-decode-type-token';
import { DEFAULT_KEY_PREFIX } from '../tokens/storage-prefix';
import { NGXS_DATA_STORAGE_PREFIX_TOKEN } from '../tokens/storage-prefix-token';
import { createDefault } from './create-default';
import { mergeOptions } from './merge-options';
import { Type } from "@angular/core";

// eslint-disable-next-line max-lines-per-function
export function ensureProviders(
    meta: NgxsRepositoryMeta,
    stateClassRef: Type<StateClass>,
    options?: ProviderOptions
): PersistenceProvider[] {
    let providers: PersistenceProvider[];
    const prefix: string =
        NgxsDataStoragePlugin.injector?.get(NGXS_DATA_STORAGE_PREFIX_TOKEN, DEFAULT_KEY_PREFIX) ?? DEFAULT_KEY_PREFIX;

    const decodeType: STORAGE_DECODE_TYPE =
        NgxsDataStoragePlugin.injector?.get(NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN, STORAGE_DECODE_TYPE.NONE) ??
        STORAGE_DECODE_TYPE.NONE;

    if (options) {
        const prepared: PersistenceProvider[] = Array.isArray(options) ? options : [options];
        providers = prepared.map(
            (option: PersistenceProvider): PersistenceProvider =>
                mergeOptions({ option, prefix, decodeType, meta, stateClassRef })
        );
    } else {
        providers = createDefault({ meta, prefix, decodeType, stateClassRef });
    }

    return providers;
}
