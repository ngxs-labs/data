import { StateClass } from '@ngxs/store/internals';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Any } from '../../../interfaces/internal.interface';
import { NgxsDataAccessor } from '../../../services/ngxs-data-accessor';
import { getRepository } from '../../../utils/internals/ensure-repository';
import { NgxsRepositoryMeta } from '../../../interfaces/external.interface';

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
                    return (
                        this[selectorId] ||
                        (this[selectorId] = NgxsDataAccessor.store!.select(stateClass as Any).pipe(
                            shareReplay({ refCount: true, bufferSize: 1 })
                        ))
                    );
                }
            }
        });
    }
}
