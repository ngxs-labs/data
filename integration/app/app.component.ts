import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public snapshot: Observable<unknown> = this.store.select((state) => state);
    constructor(private readonly store: Store) {}
}
