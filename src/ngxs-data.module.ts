import { ModuleWithProviders, NgModule, Self } from '@angular/core';
import { NGXS_PLUGINS } from '@ngxs/store';

import { NgxsDataStorageEngine } from './services/ngxs-data-storage-engine';
import { NgxsDataAccessor } from './services/ngxs-data-accessor';

@NgModule()
export class NgxsDataPluginModule {
    constructor(@Self() public accessor: NgxsDataAccessor) {}

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxsDataPluginModule,
            providers: [
                NgxsDataAccessor,
                {
                    provide: NGXS_PLUGINS,
                    useClass: NgxsDataStorageEngine,
                    multi: true
                }
            ]
        };
    }
}
