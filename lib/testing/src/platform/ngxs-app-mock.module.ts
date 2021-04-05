import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxsAppMockComponent } from './ngxs-app-mock.component';

@NgModule({
    imports: [BrowserModule],
    declarations: [NgxsAppMockComponent],
    entryComponents: [NgxsAppMockComponent]
})
export class NgxsAppMockModule {
    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    public static ngDoBootstrap(app: ApplicationRef): void {
        app.bootstrap(NgxsAppMockComponent);
    }
}
