import { NgxsModule } from '@ngxs/store';
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
                    redirectTo: 'count',
                    pathMatch: 'full'
                },
                {
                    path: 'count',
                    loadChildren: () => import('./examples/count/count.module').then((m) => m.CountModule)
                },
                {
                    path: 'todo',
                    loadChildren: () => import('./examples/todo/todo.module').then((m) => m.TodoModule)
                }
            ],
            { useHash: true }
        ),
        NgxsModule.forRoot([], {
            developmentMode: !environment.production
        }),
        NgxsLoggerPluginModule.forRoot(),
        NgxsDataPluginModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
