import { NGXS_SEQUENCE_ID } from '@ngxs-labs/data/tokens';
import { Any } from '@ngxs-labs/data/typings';

export function getSequenceIdFromTarget(target: Any): number {
    return target[NGXS_SEQUENCE_ID];
}
