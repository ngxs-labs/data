import { isGetter } from '@angular-ru/common/object';
import { Any } from '@angular-ru/common/typings';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';

export function validateComputedMethod(target: Any, name: string | symbol): void {
    const notGetter: boolean = !isGetter(target, name);
    if (notGetter) {
        throw new Error(
            NGXS_DATA_EXCEPTIONS.NGXS_COMPUTED_DECORATOR +
                `\nExample: \n@Computed() get ${name.toString()}() { \n\t .. \n}`
        );
    }
}
