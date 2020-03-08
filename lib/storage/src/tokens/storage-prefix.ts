import { Provider } from '@angular/core';

import { NGXS_DATA_STORAGE_PREFIX_TOKEN } from './storage-prefix-token';

export const DEFAULT_KEY_PREFIX: string = '@ngxs.store.';

export const NGXS_DATA_STORAGE_PREFIX: Provider = {
    provide: NGXS_DATA_STORAGE_PREFIX_TOKEN,
    useValue: DEFAULT_KEY_PREFIX
};
