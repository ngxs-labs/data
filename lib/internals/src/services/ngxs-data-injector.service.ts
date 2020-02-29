import { Inject, Injectable, Injector, NgZone } from '@angular/core';
import { Any } from '@ngxs-labs/data/typings';
import { Store } from '@ngxs/store';
import { NGXS_STATE_CONTEXT_FACTORY, NGXS_STATE_FACTORY } from '@ngxs/store/internals';

@Injectable()
export class NgxsDataInjector {
    public static store: Store | null = null;
    public static context: Any | null = null;
    public static factory: Any | null = null;
    public static ngZone: NgZone | null = null;

    constructor(
        injector: Injector,
        @Inject(NGXS_STATE_FACTORY) stateFactory: Any,
        @Inject(NGXS_STATE_CONTEXT_FACTORY) stateContextFactory: Any
    ) {
        NgxsDataInjector.store = injector.get<Store>(Store);
        NgxsDataInjector.ngZone = injector.get<NgZone>(NgZone);
        NgxsDataInjector.factory = stateFactory;
        NgxsDataInjector.context = stateContextFactory;
    }
}
