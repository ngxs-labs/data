import { EntityDictionary, EntityIdType } from './entity-types';

export type NgxsEntityCollections<V, K extends number | string = EntityIdType, C = {}> = {
    ids: K[];
    entities: EntityDictionary<K, V>;
} & C;
