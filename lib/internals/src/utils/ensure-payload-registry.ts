import { NGXS_PAYLOAD_META } from '@ngxs-labs/data/tokens';
import { Any } from '@ngxs-labs/data/typings';

import { getPayloadRegistry } from './get-payload-registry';
import { PayloadRegistry } from './payload-registry';

export function ensurePayloadRegistry(target: Any, propertyKey: Any): PayloadRegistry {
    const originMethod: Function = target[propertyKey];
    const payloadRegistry: PayloadRegistry | undefined = getPayloadRegistry(originMethod);

    if (!payloadRegistry) {
        Object.defineProperties(originMethod, {
            [NGXS_PAYLOAD_META]: {
                enumerable: true,
                configurable: true,
                value: new PayloadRegistry()
            }
        });
    }

    return getPayloadRegistry(originMethod)!;
}
