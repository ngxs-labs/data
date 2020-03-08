import { Any } from '@ngxs-labs/data/typings';

export function deepCloneDefaults(value: Any): Any {
    const prepared: Any = value === undefined ? {} : value;
    return JSON.parse(JSON.stringify(prepared));
}
