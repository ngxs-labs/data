import { Provider } from '@angular/core';

import { NGXS_DATA_STORAGE_CONTAINER_TOKEN } from './storage-container-token';
import { storageUseFactory } from './storage-use-factory';

export const NGXS_DATA_STORAGE_CONTAINER: Provider = {
    provide: NGXS_DATA_STORAGE_CONTAINER_TOKEN,
    useFactory: storageUseFactory
};
