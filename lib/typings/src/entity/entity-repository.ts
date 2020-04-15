import { ActionType } from '@ngxs/store';
import { Observable } from 'rxjs';

import { EntityUpdate } from './entity-update';
import { NgxsEntityCollections } from './ngxs-entity-collections';

export interface EntityRepository<V, K extends string | number> {
    name: string;
    initialState: NgxsEntityCollections<V, K>;
    state$: Observable<NgxsEntityCollections<V, K>>;
    readonly snapshot: NgxsEntityCollections<V, K>;
    primaryKey: string;

    getState(): NgxsEntityCollections<V, K>;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;

    reset(): void;

    selectId(entity: V): K;

    addOne(entity: V): void;

    addMany(entities: V[]): void;

    setOne(entity: V): void;

    setMany(entities: V[]): void;

    setAll(entities: V[]): void;

    updateOne(update: EntityUpdate<V, K>): void;

    updateMany(updates: EntityUpdate<V, K>[]): void;

    upsertOne(entity: V): void;

    upsertMany(entities: V[]): void;

    removeOne(id: K): void;

    removeMany(ids: K[]): void;

    removeAll(): void;
}
