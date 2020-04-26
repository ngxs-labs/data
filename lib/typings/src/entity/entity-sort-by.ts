export const enum EntitySortByOrder {
    ASC = 'asc',
    DESC = 'desc'
}

type SortDirection = EntitySortByOrder | 'asc' | 'desc' | '';

export interface EntitySortBy {
    sortBy: string;
    sortByOrder: SortDirection;
}

export type EntityCompareFn<V> = (a: V, b: V) => number;

export type EntityComparator<V> = EntitySortBy | EntityCompareFn<V>;
