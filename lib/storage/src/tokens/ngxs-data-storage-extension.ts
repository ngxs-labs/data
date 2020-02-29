import { Provider } from '@angular/core';
import { NGXS_PLUGINS } from '@ngxs/store';

import { NgxsDataStoragePlugin } from '../ngxs-data-storage-plugin.service';

export const NGXS_DATA_STORAGE_EXTENSION: Provider = {
    provide: NGXS_PLUGINS,
    useClass: NgxsDataStoragePlugin,
    multi: true
};
