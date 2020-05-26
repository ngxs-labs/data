import { Component } from '@angular/core';
import { AppState } from './app.state';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    title = 'app';

    constructor(public readonly app: AppState) {}
}
