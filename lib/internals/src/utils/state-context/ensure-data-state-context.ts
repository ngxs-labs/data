import { Any } from '@angular-ru/common/typings';
import { isDevMode } from '@angular/core';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { StateContext } from '@ngxs/store';

import { ngxsDeepFreeze } from '../common/freeze';

export function ensureDataStateContext<U, T extends StateContext<U>>(context: T | null): T {
    if (!context) {
        throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
    }

    return {
        ...context,
        getState(): U {
            return isDevMode() ? ngxsDeepFreeze(context.getState()) : context.getState();
        },
        setState(val: Any): void {
            context.setState(val);
        },
        patchState(val: Any): void {
            context.patchState(val);
        }
    };
}
