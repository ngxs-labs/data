import { NgxsModule, ɵn as StateFactory, ɵq as StateContextFactory } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(
            [
                {
                    path: '',
                    redirectTo: 'first',
                    pathMatch: 'full'
                },
                {
                    path: 'first',
                    loadChildren: () => import('./examples/first/first.module').then((m) => m.FirstModule)
                },
                {
                    path: 'second',
                    loadChildren: () => import('./examples/second/second.module').then((m) => m.SecondModule)
                }
            ],
            { useHash: true }
        ),
        NgxsModule.forRoot([], {
            developmentMode: !environment.production
        }),
        NgxsLoggerPluginModule.forRoot(),
        NgxsDataPluginModule.forRoot({ factory: StateFactory, context: StateContextFactory })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
