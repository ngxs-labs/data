import { Any } from '../interfaces/internal.interface';

export function isNotNil(val: Any): boolean {
    return val !== 'undefined' && typeof val !== 'undefined' && val !== null;
}
