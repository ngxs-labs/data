import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Immutable } from '../../interfaces/external.interface';
import { NgxsDataRepository } from '../../impl/ngxs-data.repository';
import { Any } from '../../interfaces/internal.interface';

export function query<T, R = T>(selector: (val: Immutable<T>) => Immutable<R>) {
    return <U extends NgxsDataRepository<Any> & Record<K, Observable<R>>, K extends string>(
        target: U,
        key: K
    ): void => {
        let memoized: Observable<Immutable<R>>;

        const getter = function(): Observable<Immutable<R>> {
            return (
                memoized ||
                (memoized = target.state$.pipe(
                    map((state: Immutable<T>) => selector(state)),
                    shareReplay({ refCount: true, bufferSize: 1 })
                ))
            );
        };

        Object.defineProperty(target, key, {
            enumerable: true,
            configurable: true,
            get: getter
        });
    };
}
