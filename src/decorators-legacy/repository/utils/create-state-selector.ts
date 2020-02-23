import { isDevMode } from '@angular/core';
import { NGXS_DATA_EXCEPTIONS, NgxsRepositoryMeta } from '@ngxs-labs/data/common';
import { Any } from '@ngxs-labs/data/internals';
import { StateClass } from '@ngxs/store/internals';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { NgxsDataAccessor } from '../../../services/ngxs-data-accessor';
import { getRepository } from '../../../internals/utils/ensure-repository';
import { ngxsDeepFreeze } from '../../../internals/utils/freeze';

export function createStateSelector<T>(stateClass: StateClass): void {
    const repository: NgxsRepositoryMeta = getRepository(stateClass);
    const name: string | undefined | null = (repository.stateMeta && repository.stateMeta.name) || null;

    if (name) {
        const selectorId: string = `__${name}__selector`;

        Object.defineProperties(stateClass.prototype, {
            [selectorId]: {
                writable: true,
                enumerable: false,
                configurable: true
            },
            state$: {
                enumerable: true,
                configurable: true,
                get(): Observable<Any> {
                    if (!NgxsDataAccessor.store) {
                        throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
                    }

                    return (
                        this[selectorId] ||
                        (this[selectorId] = NgxsDataAccessor.store.select(stateClass as Any).pipe(
                            map((state) => (isDevMode() ? ngxsDeepFreeze(state) : state)),
                            shareReplay({ refCount: true, bufferSize: 1 })
                        ))
                    );
                }
            }
        });
    }
}
