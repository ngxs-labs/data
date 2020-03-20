import { Any } from '@ngxs-labs/data/typings';

export function isGetter(obj: Any, prop: string | symbol): boolean {
    return !!Object.getOwnPropertyDescriptor(obj, prop)?.['get'];
}
