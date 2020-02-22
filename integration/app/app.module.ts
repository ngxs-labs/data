import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsDataUtilsModule } from '@ngxs-labs/data/utils';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        NgxsModule.forRoot([], {
            developmentMode: !environment.production
        }),
        NgxsLoggerPluginModule.forRoot(),
        NgxsDataPluginModule.forRoot(),
        NgxsDataUtilsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
