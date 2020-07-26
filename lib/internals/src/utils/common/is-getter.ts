import { Any } from '@angular-ru/common/typings';

export function isGetter(obj: Any, prop: string | symbol): boolean {
    return !!Object.getOwnPropertyDescriptor(obj, prop)?.['get'];
}
