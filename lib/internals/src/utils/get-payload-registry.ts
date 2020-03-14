import { NGXS_PAYLOAD_META } from '@ngxs-labs/data/tokens';
import { Any } from '@ngxs-labs/data/typings';

import { PayloadRegistry } from './payload-registry';

export function getPayloadRegistry(method: Function): PayloadRegistry | undefined {
    return (method as Any)[NGXS_PAYLOAD_META];
}
