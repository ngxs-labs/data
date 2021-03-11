import {
    EmptyDictionary,
    EntityCollections,
    EntityComparator,
    EntityDictionary,
    EntityIdType,
    EntitySortBy,
    EntityUpdate,
    KeysDictionary
} from '@angular-ru/common/entity';
import { sortByAsc, sortByDesc } from '@angular-ru/common/object';
import { Any, PrimaryKey, SortOrderType } from '@angular-ru/common/typings';
import { isNil } from '@angular-ru/common/utils';
import { Injectable, isDevMode } from '@angular/core';
import { Computed, DataAction, Payload } from '@ngxs-labs/data/decorators';
import { ensureDataStateContext, ensureSnapshot } from '@ngxs-labs/data/internals';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { EntityContext, EntityRepository } from '@ngxs-labs/data/typings';
import { ActionType, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AbstractRepository } from '../common/abstract-repository';

@Injectable()
export abstract class AbstractNgxsDataEntityCollectionsRepository<
        V,
        K extends number | string = EntityIdType,
        C = Record<string, Any>
    >
    extends AbstractRepository<EntityCollections<V, K, C>>
    implements EntityRepository<V, K, C> {
    public primaryKey: string = PrimaryKey.ID;
    public comparator: EntityComparator<V> | null = null;
    private readonly context!: EntityContext<V, K, C>;

    @Computed()
    public get snapshot(): EntityCollections<V, K, C> {
        return ensureSnapshot(this.getState());
    }

    @Computed()
    public get ids(): K[] {
        return this.snapshot.ids;
    }

    @Computed()
    public get entities(): EntityDictionary<K, V> {
        return this.snapshot.entities;
    }

    @Computed()
    public get entitiesArray(): V[] {
        const snapshot = this.snapshot;
        return snapshot.ids.map(id => snapshot.entities[id]);
    }

    @Computed()
    public get ids$(): Observable<K[]> {
        return this.state$.pipe(map((value: EntityCollections<V, K, C>): K[] => value.ids));
    }

    @Computed()
    public get entities$(): Observable<EntityDictionary<K, V>> {
        return this.state$.pipe(map((value: EntityCollections<V, K, C>): EntityDictionary<K, V> => value.entities));
    }

    @Computed()
    public get entitiesArray$(): Observable<V[]> {
        return this.state$.pipe(
            map((value: EntityCollections<V, K, C>): V[] => value.ids.map(id => value.entities[id]))
        );
    }

    protected get ctx(): EntityContext<V, K, C> {
        return ensureDataStateContext<EntityCollections<V, K, C>, StateContext<EntityCollections<V, K, C>>>(
            this.context as StateContext<EntityCollections<V, K, C>>
        );
    }

    public setComparator(comparator: EntityComparator<V> | null): this {
        this.comparator = comparator;
        return this;
    }

    public dispatch(actions: ActionType | ActionType[]): Observable<void> {
        return this.ctx.dispatch(actions);
    }

    public getState(): EntityCollections<V, K, C> {
        return this.ctx.getState();
    }

    public selectId(entity: V): K {
        return (entity as Any)?.[this.primaryKey];
    }

    public selectOne(id: K): V | null {
        return this.snapshot.entities[id] ?? null;
    }

    public selectAll(): V[] {
        const state: EntityCollections<V, K, C> = this.getState();
        return state.ids.map((id: K): V => state.entities[id] as V);
    }

    @DataAction()
    public reset(): void {
        this.setEntitiesState(this.initialState);
        this.markAsDirtyAfterReset();
    }

    @DataAction()
    public addOne(@Payload('entity') entity: V): void {
        this.addEntityOne(entity);
    }

    @DataAction()
    public addMany(@Payload('entities') entities: V[]): void {
        this.addEntitiesMany(entities);
    }

    @DataAction()
    public setOne(@Payload('entity') entity: V): void {
        this.setEntityOne(entity);
    }

    @DataAction()
    public setMany(@Payload('entities') entities: V[]): void {
        this.setEntitiesMany(entities);
    }

    @DataAction()
    public setAll(@Payload('entities') entities: V[]): void {
        this.setEntitiesAll(entities);
    }

    @DataAction()
    public updateOne(@Payload('update') update: EntityUpdate<V, K>): void {
        this.updateEntitiesMany([update]);
    }

    @DataAction()
    public updateMany(@Payload('updates') updates: EntityUpdate<V, K>[]): void {
        this.updateEntitiesMany(updates);
    }

    @DataAction()
    public upsertOne(@Payload('entity') entity: V): void {
        this.upsertEntitiesMany([entity]);
    }

    @DataAction()
    public upsertMany(@Payload('entities') entities: V[]): void {
        this.upsertEntitiesMany(entities);
    }

    @DataAction()
    public removeOne(@Payload('id') id: K): void {
        this.removeEntitiesMany([id]);
    }

    @DataAction()
    public removeMany(@Payload('ids') ids: K[]): void {
        this.removeEntitiesMany(ids);
    }

    @DataAction()
    public removeByEntity(@Payload('entity') entity: V): void {
        const id: K = this.selectId(entity);
        this.removeEntitiesMany([id]);
    }

    @DataAction()
    public removeByEntities(@Payload('entities') entities: V[]): void {
        const ids: K[] = [];
        for (const entity of entities) {
            const id: K = this.selectId(entity);
            ids.push(id);
        }

        this.removeEntitiesMany(ids);
    }

    @DataAction()
    public removeAll(): void {
        this.setEntitiesState(this.initialState);
    }

    @DataAction()
    public sort(@Payload('comparator') comparator?: EntityComparator<V>): void {
        this.comparator = comparator ?? this.comparator;

        if (isNil(this.comparator)) {
            console.warn(NGXS_DATA_EXCEPTIONS.NGXS_COMPARE);
            return;
        }

        this.setEntitiesState(this.getState());
    }

    protected addEntityOne(entity: V): void {
        const state: EntityCollections<V, K, C> = this.getState();
        const id: K = this.selectIdValue(entity);

        if (id in state.entities) {
            return;
        }

        this.setEntitiesState({
            ...state,
            ids: [...state.ids, id],
            entities: { ...state.entities, [id]: entity }
        });
    }

    protected addEntitiesMany(entities: V[]): void {
        const state: EntityCollections<V, K, C> = this.getState();
        const dictionary: EntityDictionary<K, V> | EmptyDictionary<K, V> = {};
        const ids: K[] = [];

        for (const entity of entities) {
            const id: K = this.selectIdValue(entity);

            if (id in state.entities || id in dictionary) {
                continue;
            }

            ids.push(id);
            dictionary[id] = entity;
        }

        if (ids.length) {
            this.setEntitiesState({
                ...state,
                ids: [...state.ids, ...ids],
                entities: { ...state.entities, ...dictionary }
            });
        }
    }

    protected setEntitiesAll(entities: V[]): void {
        const state: EntityCollections<V, K, C> = this.getState();
        const dictionary: EntityDictionary<K, V> | EmptyDictionary<K, V> = {};
        const ids: K[] = [];

        for (const entity of entities) {
            const id: K = this.selectIdValue(entity);

            if (id in dictionary) {
                continue;
            }

            ids.push(id);
            dictionary[id] = entity;
        }

        this.setEntitiesState({ ...state, ids, entities: dictionary as EntityDictionary<K, V> });
    }

    protected setEntityOne(entity: V): void {
        const state: EntityCollections<V, K, C> = this.getState();
        const id: K = this.selectIdValue(entity);

        if (id in state.entities) {
            this.setEntitiesState({ ...state, entities: { ...state.entities, [id]: entity } });
        } else {
            this.setEntitiesState({ ...state, ids: [...state.ids, id], entities: { ...state.entities, [id]: entity } });
        }
    }

    protected setEntitiesMany(entities: V[]): void {
        for (const entity of entities) {
            this.setEntityOne(entity);
        }
    }

    protected updateEntitiesMany(updates: EntityUpdate<V, K>[]): void {
        const state: EntityCollections<V, K, C> = this.getState();
        updates = updates.filter((update: EntityUpdate<V, K>): boolean => update.id in state.entities);
        if (updates.length === 0) {
            return;
        }

        const keys: KeysDictionary<K> = this.generateKeyMap(state);
        const entities: EntityDictionary<K, V> = { ...state.entities };

        for (const update of updates) {
            const updated: V = this.updateOrigin(entities, update);
            const newId: K = this.selectIdValue(updated);

            if (newId !== update.id) {
                delete keys[update.id];
                delete entities[update.id];
            }

            keys[update.id] = newId;
            entities[newId] = updated;
        }

        this.setEntitiesState({ ...state, ids: state.ids.map((id: K): K => keys[id] ?? id), entities });
    }

    protected upsertEntitiesMany(entities: V[]): void {
        const state: EntityCollections<V, K, C> = this.getState();
        const updates: EntityUpdate<V, K>[] = [];
        const added: V[] = [];

        for (const entity of entities) {
            const id: K = this.selectIdValue(entity);
            if (id in state.entities) {
                updates.push({ id, changes: entity });
            } else {
                added.push(entity);
            }
        }

        this.updateMany(updates);
        this.addMany(added);
    }

    protected removeEntitiesMany(ids: K[]): void {
        const state: EntityCollections<V, K, C> = this.getState();
        const keys: KeysDictionary<K> = this.generateKeyMap(state);
        const entities: EntityDictionary<K, V> = { ...state.entities };

        for (const id of ids) {
            if (id in entities) {
                delete keys[id];
                delete entities[id];
            }
        }

        this.setEntitiesState({ ...state, ids: state.ids.filter((id: K): boolean => id in keys), entities });
    }

    protected setEntitiesState(state: EntityCollections<V, K, C>): void {
        const ids: K[] = this.sortKeysByComparator(state.ids, state.entities);
        this.ctx.setState({ ...state, ids, entities: state.entities });
    }

    protected sortKeysByComparator(originalIds: K[], entities: EntityDictionary<K, V>): K[] {
        if (isNil(this.comparator)) {
            return originalIds;
        }

        const ids: K[] = originalIds.slice();
        const comparator: EntityComparator<V> = this.comparator;

        if (typeof comparator === 'function') {
            return ids.sort((a: K, b: K): number => comparator(entities[a] as V, entities[b] as V));
        }

        return this.sortByComparatorOptions(ids, comparator, entities);
    }

    private sortByComparatorOptions(ids: K[], comparator: EntitySortBy<V>, entities: EntityDictionary<K, V>): K[] {
        switch (comparator?.sortByOrder) {
            case SortOrderType.ASC:
                return ids.sort((a: K, b: K): number =>
                    sortByAsc(comparator?.sortBy, entities[a] as V, entities[b] as V)
                );
            case SortOrderType.DESC:
                return ids.sort((a: K, b: K): number =>
                    sortByDesc(comparator?.sortBy, entities[a] as V, entities[b] as V)
                );
            default:
                if (isDevMode()) {
                    console.warn(`Invalid --> { sortByOrder: "${comparator?.sortByOrder}" } not supported!`);
                }

                return ids;
        }
    }

    private generateKeyMap(state: EntityCollections<V, K, C>): KeysDictionary<K> {
        return state.ids.reduce((keyDictionary: KeysDictionary<K>, id: K): KeysDictionary<K> => {
            keyDictionary[id] = id;
            return keyDictionary;
        }, {});
    }

    private updateOrigin(entities: EntityDictionary<K, V>, update: EntityUpdate<V, K>): V {
        const original: V | undefined = entities[update.id];
        return { ...original, ...update.changes } as V;
    }

    private selectIdValue(entity: V): K {
        const id: K = this.selectId(entity);
        const invalidId: boolean = isNil(id) && isDevMode();

        if (invalidId) {
            console.warn(
                `The entity passed to the 'selectId' implementation returned ${id}.`,
                `You should probably provide your own 'selectId' implementation.`,
                'The entity that was passed:',
                entity,
                'The current `selectId` implementation: (entity: V): K => entity.id'
            );
        }

        return id;
    }
}
