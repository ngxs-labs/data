import { Component } from '@angular/core';

import { AppState } from './app.state';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    public title: string = 'app';

    constructor(public readonly app: AppState) {}
}
