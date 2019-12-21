import { Any } from '../interfaces/internal.interface';

export function clone(value: Any): Any {
    return JSON.parse(JSON.stringify(value));
}

export function isNotNil(val: Any): boolean {
    return val !== 'undefined' && typeof val !== 'undefined' && val !== null;
}
