import { EntityCollections, EntityUpdate } from '@angular-ru/common/entity';
import { Any } from '@angular-ru/common/typings';
import { ActionType } from '@ngxs/store';
import { Observable } from 'rxjs';

export interface EntityRepository<V, K extends string | number, C = Record<string, Any>> {
    name: string;
    initialState: EntityCollections<V, K, C>;
    state$: Observable<EntityCollections<V, K, C>>;
    readonly snapshot: EntityCollections<V, K, C>;
    primaryKey: string;

    getState(): EntityCollections<V, K, C>;

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

    removeByEntity(entity: V): void;

    removeMany(ids: K[]): void;

    removeByEntities(entities: V[]): void;

    removeAll(): void;
}
