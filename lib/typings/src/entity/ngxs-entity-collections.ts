import { Any } from '@angular-ru/common/typings';

import { EntityDictionary, EntityIdType } from './entity-types';

export type NgxsEntityCollections<V, K extends number | string = EntityIdType, C = Record<string, Any>> = {
    ids: K[];
    entities: EntityDictionary<K, V>;
} & C;
