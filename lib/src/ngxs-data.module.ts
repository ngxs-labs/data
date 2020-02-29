import { ModuleWithProviders, NgModule, Provider, Self } from '@angular/core';
import { NgxsDataFactory, NgxsDataInjector } from '@ngxs-labs/data/internals';

@NgModule()
export class NgxsDataPluginModule {
    constructor(@Self() public accessor: NgxsDataFactory, @Self() public injector: NgxsDataInjector) {}

    public static forRoot(extensions: Provider[] = []): ModuleWithProviders<NgxsDataPluginModule> {
        return {
            ngModule: NgxsDataPluginModule,
            providers: [NgxsDataFactory, NgxsDataInjector, ...extensions]
        };
    }
}
