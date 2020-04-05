import { ensureComputedCache, globalSequenceId, itObservable, validateComputedMethod } from '@ngxs-labs/data/internals';
import { Any, ComputedCacheMap, ComputedOptions, Descriptor } from '@ngxs-labs/data/typings';
import { Observable } from 'rxjs';

// eslint-disable-next-line max-lines-per-function
export function Computed(): MethodDecorator {
    // eslint-disable-next-line max-lines-per-function
    return (target: Any, key: string | symbol, descriptor: Descriptor): Descriptor => {
        validateComputedMethod(target, key);
        const originalMethod: Any = descriptor.get;

        descriptor.get = function(...args: Any[]): Observable<Any> | Any {
            const cacheMap: ComputedCacheMap = ensureComputedCache(this);
            const cache: ComputedOptions | undefined = cacheMap?.get(originalMethod);
            if (cache?.isObservable) {
                return cache.value as Observable<Any>;
            }

            const invalidCache: boolean = !cache || cache.sequenceId !== globalSequenceId();

            if (invalidCache) {
                cacheMap.delete(originalMethod);
                const value: Observable<Any> | Any = originalMethod.apply(this, args);

                cacheMap.set(originalMethod, {
                    value,
                    sequenceId: globalSequenceId(),
                    isObservable: itObservable(value)
                });

                return value;
            } else {
                return cache!.value;
            }
        };

        return descriptor;
    };
}
