import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsDataPluginModule } from '@ngxs-labs/data';

import { AppState } from './app.state';

@NgModule({
    imports: [
        NgxsModule.forRoot([AppState]),
        NgxsLoggerPluginModule.forRoot(),
        NgxsDataPluginModule.forRoot()
    ],
    exports: [NgxsModule]
})
export class StoreModule {}
