import { Any } from '@ngxs-labs/data/typings';

export function entitySortByAsc<V>(key: string, a: Any, b: Any): number {
    if (a?.[key] > b?.[key]) {
        return 1;
    } else {
        return a?.[key] < b?.[key] ? -1 : 0;
    }
}
