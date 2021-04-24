import { isDevMode } from '@angular/core';
import { deepFreeze } from '@angular-ru/common/object';

export function ensureSnapshot<T>(state: T): T {
    return isDevMode() ? deepFreeze(state) : state;
}
