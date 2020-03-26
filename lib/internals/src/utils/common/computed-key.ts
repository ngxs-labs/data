import { NGXS_COMPUTED_OPTION } from '@ngxs-labs/data/tokens';

export function computedKey(key: string | symbol): string {
    return `__${NGXS_COMPUTED_OPTION}__${key.toString()}`;
}
