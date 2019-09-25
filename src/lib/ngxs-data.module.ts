import { ModuleWithProviders, NgModule, Self } from '@angular/core';
import { ɵn as StateFactory, ɵq as StateContextFactory } from '@ngxs/store';

import { STATE_CONTEXT_FACTORY, STATE_FACTORY } from './interfaces/internal.interface';
import { NgxsDataAccessor } from './services/data-access-injector.service';
import { NgxsDataOptions } from './interfaces/external.interface';

@NgModule()
export class NgxsDataPluginModule {
    constructor(@Self() public accessor: NgxsDataAccessor) {}

    public static forRoot(options: NgxsDataOptions = {}): ModuleWithProviders {
        return {
            ngModule: NgxsDataPluginModule,
            providers: [
                {
                    provide: STATE_FACTORY,
                    useValue: options.factory || StateFactory
                },
                {
                    provide: STATE_CONTEXT_FACTORY,
                    useValue: options.context || StateContextFactory
                },
                NgxsDataAccessor
            ]
        };
    }
}
