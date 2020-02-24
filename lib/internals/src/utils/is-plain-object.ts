import { Any } from '@ngxs-labs/data/typings';

export function isPlainObject(item: Any): boolean {
    return typeof item === 'object' && !Array.isArray(item) && item !== null;
}
