import { Provider } from '@angular/core';

import { NgxsDataStorageContainer } from '../ngxs-data-storage-container';
import { NGXS_DATA_STORAGE_CONTAINER_TOKEN } from './storage-container-token';

export const NGXS_DATA_STORAGE_CONTAINER: Provider = {
    provide: NGXS_DATA_STORAGE_CONTAINER_TOKEN,
    useFactory: (): NgxsDataStorageContainer => new NgxsDataStorageContainer()
};
