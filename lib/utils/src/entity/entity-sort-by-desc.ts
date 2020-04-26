export function entitySortByDesc<V>(key: keyof V, a: V, b: V): number {
    if (a?.[key]! > b?.[key]!) {
        return -1;
    } else {
        return a?.[key]! < b?.[key]! ? 1 : 0;
    }
}
