import { InjectionToken } from '@angular/core';
import { StorageContainer } from '@ngxs-labs/data/typings';

export const NGXS_DATA_STORAGE_CONTAINER_TOKEN: InjectionToken<StorageContainer> = new InjectionToken(
    'NGXS_DATA_STORAGE_CONTAINER_TOKEN'
);
