
import { NgxsAsyncStoragePlugin } from '@ngxs-labs/async-storage-plugin';
import { NgxsDataExtension } from '@ngxs-labs/data/typings';
import { NGXS_PLUGINS } from '@ngxs/store';

export const NGXS_DATA_ASYNC_STORAGE_PLUGIN: NgxsDataExtension = {

    provide: NGXS_PLUGINS,
    useClass: NgxsAsyncStoragePlugin,
    multi: true,
};
