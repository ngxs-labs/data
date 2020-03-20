import { NGXS_SEQUENCE_ID } from '@ngxs-labs/data/tokens';
import { Any } from '@ngxs-labs/data/typings';

export function incrementSequenceId(target: Any): void {
    target[NGXS_SEQUENCE_ID]++;
}
