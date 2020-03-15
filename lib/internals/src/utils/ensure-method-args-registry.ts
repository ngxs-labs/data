import { NGXS_ARGUMENT_REGISTRY_META } from '@ngxs-labs/data/tokens';
import { Any } from '@ngxs-labs/data/typings';

import { getMethodArgsRegistry } from './get-method-args-registry';
import { MethodArgsRegistry } from './method-args-registry';

export function ensureMethodArgsRegistry(target: Any, propertyKey: Any): MethodArgsRegistry {
    const originMethod: Function = target[propertyKey];
    const registry: MethodArgsRegistry | undefined = getMethodArgsRegistry(originMethod);

    if (!registry) {
        Object.defineProperties(originMethod, {
            [NGXS_ARGUMENT_REGISTRY_META]: {
                enumerable: true,
                configurable: true,
                value: new MethodArgsRegistry()
            }
        });
    }

    return getMethodArgsRegistry(originMethod)!;
}
