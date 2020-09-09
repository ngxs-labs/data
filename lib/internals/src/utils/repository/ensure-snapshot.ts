import { deepFreeze } from '@angular-ru/common/object';
import { isDevMode } from '@angular/core';

export function ensureSnapshot<T>(state: T): T {
    return isDevMode() ? deepFreeze(state) : state;
}
