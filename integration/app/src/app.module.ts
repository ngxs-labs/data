import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NGXS_DATA_STORAGE_CONTAINER, NGXS_DATA_STORAGE_EXTENSION } from '@ngxs-labs/data/storage';
import { NgxsDataUtilsModule } from '@ngxs-labs/data/utils';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule, NoopNgxsExecutionStrategy } from '@ngxs/store';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        NgxsModule.forRoot([], {
            developmentMode: !environment.production,
            executionStrategy: NoopNgxsExecutionStrategy
        }),
        NgxsLoggerPluginModule.forRoot(),
        NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER]),
        NgxsDataUtilsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
