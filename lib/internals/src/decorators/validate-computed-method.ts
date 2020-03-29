import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { Any } from '@ngxs-labs/data/typings';

import { isGetter } from '../utils/common/is-getter';

export function validateComputedMethod(target: Any, name: string | symbol): void {
    const notGetter: boolean = !isGetter(target, name);
    if (notGetter) {
        throw new Error(
            NGXS_DATA_EXCEPTIONS.NGXS_COMPUTED_DECORATOR +
                `\nExample: \n@Computed() get ${name.toString()}() { \n\t .. \n}`
        );
    }
}
