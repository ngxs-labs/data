import { NgxsDataStorageContainer } from '../ngxs-data-storage-container';

export function storageUseFactory(): NgxsDataStorageContainer {
    return new NgxsDataStorageContainer();
}
