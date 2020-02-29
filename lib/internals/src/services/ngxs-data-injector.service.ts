import { Injectable, Injector } from '@angular/core';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';

@Injectable()
export class NgxsDataInjector {
    private static injector: Injector | null = null;

    constructor(injector: Injector) {
        NgxsDataInjector.injector = injector;
    }

    public static getInjector(): never | Injector {
        if (!NgxsDataInjector.injector) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
        }

        return NgxsDataInjector.injector;
    }
}
