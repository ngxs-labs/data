import { EntityDictionary, EntityIdType, NgxsEntityCollections } from '@ngxs-labs/data/typings';

export function createEntityCollections<V, K extends string | number = EntityIdType>(
    collections?: NgxsEntityCollections<V, K>
): NgxsEntityCollections<V, K> {
    return (
        collections ?? {
            ids: [],
            entities: {} as EntityDictionary<K, V>
        }
    );
}
