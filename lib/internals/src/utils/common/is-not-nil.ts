import { Any } from '@ngxs-labs/data/typings';

export function isNotNil(val: Any): boolean {
    return val !== 'undefined' && typeof val !== 'undefined' && val !== null;
}
