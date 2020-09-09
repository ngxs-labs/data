import { ApplicationRef, destroyPlatform, ModuleWithProviders, NgModule, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NGXS_DATA_STORAGE_CONTAINER, NGXS_DATA_STORAGE_EXTENSION } from '@ngxs-labs/data/storage';
import { NgxsModule } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';

import { createInternalNgxsRootElement } from './internal/create-internal-ngxs-root-element';
import { patchConsoleLog } from './internal/patch-console-log';
import { NgxsAppMockModule } from './ngxs-app-mock.module';

type NgxsDataTestingModuleProviders = [
    Type<NgxsAppMockModule>,
    ModuleWithProviders<NgxsModule>,
    ModuleWithProviders<NgxsDataPluginModule>
];

@NgModule({
    imports: [NgxsModule],
    exports: [NgxsModule]
})
export class NgxsDataTestingModule {
    public static forRoot(states: StateClass[] = []): NgxsDataTestingModuleProviders {
        return [
            NgxsAppMockModule,
            NgxsModule.forRoot(states, { developmentMode: true, selectorOptions: { suppressErrors: false } }),
            NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
        ];
    }

    public static ngxsInitPlatform(): void {
        patchConsoleLog();
        destroyPlatform();
        createInternalNgxsRootElement();
        NgxsAppMockModule.ngDoBootstrap(TestBed.inject(ApplicationRef));
    }
}
