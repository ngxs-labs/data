import { Any } from '@angular-ru/common/typings';

export function isPlainObject(item: Any): boolean {
    return typeof item === 'object' && !Array.isArray(item) && item !== null;
}
