import { isDevMode } from '@angular/core';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { Any } from '@ngxs-labs/data/typings';
import { StateContext } from '@ngxs/store';

import { ngxsDeepFreeze } from '../common/freeze';
import { incrementSequenceId } from '../computed/increment-sequence-id';

export function ensureDataStateContext<U, T extends StateContext<U>>(target: Any, context: T | null): T {
    if (!context) {
        throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
    }

    return {
        ...context,
        getState(): U {
            return isDevMode() ? ngxsDeepFreeze(context.getState()) : context.getState();
        },
        setState(val: Any): void {
            incrementSequenceId(target);
            context.setState(val);
        },
        patchState(val: Any): void {
            incrementSequenceId(target);
            context.patchState(val);
        }
    };
}
