import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsDataPluginModule, NgxsDataUtilsModule } from '@ngxs-labs/data';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

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
