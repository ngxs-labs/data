import { isDevMode } from '@angular/core';

import { ngxsDeepFreeze } from '../common/freeze';

export function ensureSnapshot<T>(state: T): T {
    return isDevMode() ? ngxsDeepFreeze(state) : state;
}
