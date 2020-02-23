import { Any } from '../types/symbols';

export function isPlainObject(item: Any): boolean {
    return typeof item === 'object' && !Array.isArray(item) && item !== null;
}
