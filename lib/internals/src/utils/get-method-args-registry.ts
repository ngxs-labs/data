import { NGXS_ARGUMENT_REGISTRY_META } from '@ngxs-labs/data/tokens';
import { Any } from '@ngxs-labs/data/typings';

import { MethodArgsRegistry } from './method-args-registry';

export function getMethodArgsRegistry(method: Function): MethodArgsRegistry | undefined {
    return (method as Any)[NGXS_ARGUMENT_REGISTRY_META];
}
