import { NGXS_COMPUTED_OPTION } from '@ngxs-labs/data/tokens';

export function computedKey(): string {
    return `__${NGXS_COMPUTED_OPTION}__`;
}
