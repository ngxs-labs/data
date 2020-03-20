import {
    defineComputedOptions,
    ensureComputedOptions,
    getSequenceIdFromTarget,
    validateComputedMethod
} from '@ngxs-labs/data/internals';
import { Any, ComputedOptions, Descriptor } from '@ngxs-labs/data/typings';

export function computed(): MethodDecorator {
    return (target: Any, key: string | symbol, descriptor: Descriptor): Descriptor => {
        validateComputedMethod(target, key);
        const originalMethod: Any = descriptor.get;

        descriptor.get = function(...args: Any[]): Any {
            const options: ComputedOptions = ensureComputedOptions(descriptor.get);
            const sequenceId: number = getSequenceIdFromTarget(this);
            const invalidSequenceId: boolean = options.sequenceId !== sequenceId;

            if (invalidSequenceId) {
                const result: Any = originalMethod.apply(this, args);
                defineComputedOptions(descriptor.get, { sequenceId, value: result });
                return result;
            } else {
                return options.value;
            }
        };

        return descriptor;
    };
}
