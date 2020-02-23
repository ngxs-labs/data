import { Any } from '../types/symbols';

export function isNotNil(val: Any): boolean {
    return val !== 'undefined' && typeof val !== 'undefined' && val !== null;
}
