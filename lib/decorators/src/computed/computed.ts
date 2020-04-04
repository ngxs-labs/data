import { ensureComputedCache, globalSequenceId, validateComputedMethod } from '@ngxs-labs/data/internals';
import { Any, ComputedCacheMap, ComputedOptions, Descriptor } from '@ngxs-labs/data/typings';

export function Computed(): MethodDecorator {
    return (target: Any, key: string | symbol, descriptor: Descriptor): Descriptor => {
        validateComputedMethod(target, key);
        const originalMethod: Any = descriptor.get;

        descriptor.get = function(...args: Any[]): Any {
            const cacheMap: ComputedCacheMap = ensureComputedCache(this);
            const cache: ComputedOptions | undefined = cacheMap?.get(originalMethod);
            const invalidCache: boolean = !cache || cache.sequenceId !== globalSequenceId();

            if (invalidCache) {
                cacheMap.delete(originalMethod);
                const result: Any = originalMethod.apply(this, args);
                cacheMap.set(originalMethod, { sequenceId: globalSequenceId(), value: result });
                return result;
            } else {
                return cache!.value;
            }
        };

        return descriptor;
    };
}
