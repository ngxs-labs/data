import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { PersistenceProvider, StorageContainer } from '@ngxs-labs/data/typings';

import { NgxsDataStoragePlugin } from '../ngxs-data-storage-plugin.service';
import { NGXS_DATA_STORAGE_CONTAINER_TOKEN } from '../tokens/ngxs-data-storage-container';

export function setStorageOptions(options: PersistenceProvider[]): void {
    try {
        const container: StorageContainer = NgxsDataStoragePlugin.injector?.get(NGXS_DATA_STORAGE_CONTAINER_TOKEN)!;
        options.forEach((option: PersistenceProvider) => container!.providers.add(option));
    } catch {
        throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_CONTAINER);
    }
}
