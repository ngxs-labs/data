import { NGXS_DATA_STORAGE_EVENT_TYPE } from '@ngxs-labs/data/tokens';
import { ActionType } from '@ngxs/store';

export function isStorageEvent(action: ActionType): boolean {
    return action.type === NGXS_DATA_STORAGE_EVENT_TYPE;
}
