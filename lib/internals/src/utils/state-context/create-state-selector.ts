import { Any } from '@angular-ru/common/typings';
import { isDevMode } from '@angular/core';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { DataStateClass, NgxsRepositoryMeta } from '@ngxs-labs/data/typings';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { NgxsDataInjector } from '../../services/ngxs-data-injector.service';
import { ngxsDeepFreeze } from '../common/freeze';
import { getRepository } from '../repository/get-repository';

// eslint-disable-next-line max-lines-per-function
export function createStateSelector(stateClass: DataStateClass): void {
    const repository: NgxsRepositoryMeta = getRepository(stateClass);
    const name: string | undefined | null = (repository.stateMeta && repository.stateMeta.name) || null;

    if (name) {
        const selectorId: string = `__${name}__selector`;

        Object.defineProperties(stateClass.prototype, {
            [selectorId]: { writable: true, enumerable: false, configurable: true },
            state$: {
                enumerable: true,
                configurable: true,
                get(): Observable<Any> {
                    if (this[selectorId]) {
                        return this[selectorId];
                    } else {
                        if (!NgxsDataInjector.store) {
                            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
                        }

                        this[selectorId] = NgxsDataInjector.store.select(stateClass as Any).pipe(
                            map((state: Any): Any => (isDevMode() ? ngxsDeepFreeze(state) : state)),
                            shareReplay({ refCount: true, bufferSize: 1 })
                        );
                    }

                    return this[selectorId];
                }
            }
        });
    }
}
