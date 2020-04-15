import { EntityDictionary, EntityIdType } from './entity-types';

export interface NgxsEntityCollections<V, K extends number | string = EntityIdType> {
    ids: K[];
    entities: EntityDictionary<K, V>;
}
