import { ActionType } from '@ngxs/store';
import { NGXS_DATA_STORAGE_EVENT_TYPE } from '@ngxs-labs/data/tokens';

export function isStorageEvent(action: ActionType): boolean {
    return action.type === NGXS_DATA_STORAGE_EVENT_TYPE;
}
