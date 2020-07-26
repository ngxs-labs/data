import { Any } from '@angular-ru/common/typings';

export function deepClone(value: Any): Any {
    const prepared: Any = value === undefined ? {} : value;
    return JSON.parse(JSON.stringify(prepared));
}
