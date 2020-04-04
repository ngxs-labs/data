import { Injectable, OnDestroy, Optional } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable()
export class NgxsDataSequence implements OnDestroy {
    public readonly sequence$: BehaviorSubject<number> = new BehaviorSubject(0);
    private subscription: Subscription | null = null;

    constructor(@Optional() store?: Store) {
        if (store) {
            this.subscription = store.subscribe((): void => this.updateSequence());
        }
    }

    public get sequenceValue(): number {
        return this.sequence$.getValue();
    }

    public ngOnDestroy(): void {
        this.sequence$.next(0);
        this.subscription?.unsubscribe();
    }

    public updateSequence(): void {
        this.sequence$.next(this.sequenceValue + 1);
    }
}
