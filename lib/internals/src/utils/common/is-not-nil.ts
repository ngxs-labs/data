import { Any } from '@angular-ru/common/typings';

export function isNotNil(val: Any): boolean {
    return val !== 'undefined' && typeof val !== 'undefined' && val !== null;
}

export function isNullOrUndefined(val: Any): boolean {
    return !isNotNil(val);
}
