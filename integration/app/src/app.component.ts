import { ChangeDetectionStrategy, Component, isDevMode, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    public snapshot: Observable<unknown> = this.store.select((state: unknown): unknown => state);

    constructor(private readonly store: Store) {}

    public ngOnInit(): void {
        // eslint-disable-next-line no-console
        console.log('[isDevMode]', isDevMode());
    }
}
