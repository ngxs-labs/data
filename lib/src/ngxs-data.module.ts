import { ModuleWithProviders, NgModule, Self } from '@angular/core';
import { NgxsDataFactory, NgxsDataInjector, NgxsDataSequence } from '@ngxs-labs/data/internals';
import { NgxsDataExtension } from '@ngxs-labs/data/typings';

@NgModule()
export class NgxsDataPluginModule {
    constructor(@Self() public accessor: NgxsDataFactory, @Self() public injector: NgxsDataInjector) {}

    public static forRoot(extensions: NgxsDataExtension[] = []): ModuleWithProviders<NgxsDataPluginModule> {
        return {
            ngModule: NgxsDataPluginModule,
            providers: [NgxsDataFactory, NgxsDataInjector, NgxsDataSequence, ...extensions]
        };
    }
}
