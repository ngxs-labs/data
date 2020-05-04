import { Provider } from '@angular/core';

import { NGXS_DATA_STORAGE_CONTAINER } from './tokens/storage-container-provider';
import { NGXS_DATA_STORAGE_DECODE_TYPE } from './tokens/storage-decode-type';
import { NGXS_DATA_STORAGE_EXTENSION } from './tokens/storage-extension-provider';
import { NGXS_DATA_STORAGE_PREFIX } from './tokens/storage-prefix';

export { NgxsDataStoragePlugin } from './ngxs-data-storage-plugin.service';
export { NgxsDataStorageContainer } from './ngxs-data-storage-container';
export { registerStorageProviders } from './utils/register-storage-providers';
export { ensureProviders } from './utils/ensure-providers';
export { isStorageEvent } from './utils/is-storage-event';
export { NGXS_DATA_STORAGE_EXTENSION } from './tokens/storage-extension-provider';
export { NGXS_DATA_STORAGE_CONTAINER_TOKEN } from './tokens/storage-container-token';
export { NGXS_DATA_STORAGE_PREFIX_TOKEN } from './tokens/storage-prefix-token';
export { NGXS_DATA_STORAGE_CONTAINER } from './tokens/storage-container-provider';
export { NGXS_DATA_STORAGE_PREFIX, DEFAULT_KEY_PREFIX } from './tokens/storage-prefix';
export { NGXS_DATA_STORAGE_DECODE_TYPE } from './tokens/storage-decode-type';

export const NGXS_DATA_STORAGE_PLUGIN: Provider[] = [
    NGXS_DATA_STORAGE_EXTENSION,
    NGXS_DATA_STORAGE_CONTAINER,
    NGXS_DATA_STORAGE_PREFIX,
    NGXS_DATA_STORAGE_DECODE_TYPE
];
