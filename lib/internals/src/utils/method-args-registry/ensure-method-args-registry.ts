import { Any, Fn } from '@angular-ru/common/typings';
import { isNil } from '@angular-ru/common/utils';
import { NGXS_ARGUMENT_REGISTRY_META } from '@ngxs-labs/data/tokens';

import { getMethodArgsRegistry } from './get-method-args-registry';
import { MethodArgsRegistry } from './method-args-registry';

export function ensureMethodArgsRegistry(target: Any, propertyKey: Any): MethodArgsRegistry {
    const originMethod: Fn = target[propertyKey];
    const registry: MethodArgsRegistry | undefined = getMethodArgsRegistry(originMethod);

    if (isNil(registry)) {
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
