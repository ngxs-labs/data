import { Any, Fn } from '@angular-ru/common/typings';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';

export function validateAction(target: Fn, descriptor: TypedPropertyDescriptor<Any>): void {
    const isStaticMethod: boolean = target.hasOwnProperty('prototype');

    if (isStaticMethod) {
        throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATIC_ACTION);
    }

    if (descriptor === undefined) {
        throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_ACTION);
    }
}
