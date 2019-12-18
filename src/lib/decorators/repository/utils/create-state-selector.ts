import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { getRepository } from '../../../internals/ensure-repository';
import { Any } from '../../../interfaces/internal.interface';
import { NgxsDataAccessor } from '../../../services/ngxs-data-accessor';

export function createStateSelector<T>(stateClass: Function): void {
    const name: string = getRepository(stateClass).stateMeta.name;
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
                return (
                    this[selectorId] ||
                    (this[selectorId] = NgxsDataAccessor.store
                        .select(stateClass as Any)
                        .pipe(shareReplay({ refCount: true, bufferSize: 1 })))
                );
            }
        }
    });
}
