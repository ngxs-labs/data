import { NgModule } from '@angular/core';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';

import { AppState } from './app.state';

@NgModule({
    imports: [NgxsModule.forRoot([AppState]), NgxsLoggerPluginModule.forRoot(), NgxsDataPluginModule.forRoot()],
    exports: [NgxsModule]
})
export class StoreModule {}
