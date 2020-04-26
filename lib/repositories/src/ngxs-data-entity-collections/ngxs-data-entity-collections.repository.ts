import { isDevMode } from '@angular/core';
import { Computed, DataAction, Payload } from '@ngxs-labs/data/decorators';
import { ensureDataStateContext, ensureSnapshot, isNullOrUndefined } from '@ngxs-labs/data/internals';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import {
    Any,
    EmptyDictionary,
    EntityComparator,
    EntityContext,
    EntityDictionary,
    EntityIdType,
    EntityRepository,
    EntitySortBy,
    EntitySortByOrder,
    EntityUpdate,
    KeysDictionary,
    NgxsEntityCollections,
    PRIMARY_KEY
} from '@ngxs-labs/data/typings';
import { entitySortByAsc, entitySortByDesc } from '@ngxs-labs/data/utils';
import { ActionType, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AbstractRepository } from '../common/abstract-repository';

export class NgxsDataEntityCollectionsRepository<V, K extends number | string = EntityIdType>
    extends AbstractRepository<NgxsEntityCollections<V, K>>
    implements EntityRepository<V, K> {
    public primaryKey: string = PRIMARY_KEY.ID;
    public comparator: EntityComparator<V> | null = null;
    private readonly context!: EntityContext<V, K>;

    @Computed()
    public get snapshot(): NgxsEntityCollections<V, K> {
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
    public get ids$(): Observable<K[]> {
        return this.state$.pipe(map((value: NgxsEntityCollections<V, K>): K[] => value.ids));
    }

    @Computed()
    public get entities$(): Observable<EntityDictionary<K, V>> {
        return this.state$.pipe(map((value: NgxsEntityCollections<V, K>): EntityDictionary<K, V> => value.entities));
    }

    private get ctx(): EntityContext<V, K> {
        return ensureDataStateContext<NgxsEntityCollections<V, K>, StateContext<NgxsEntityCollections<V, K>>>(
            this.context as StateContext<NgxsEntityCollections<V, K>>
        );
    }

    public setComparator(comparator: EntityComparator<V> | null): this {
        this.comparator = comparator;
        return this;
    }

    public dispatch(actions: ActionType | ActionType[]): Observable<void> {
        return this.ctx.dispatch(actions);
    }

    public getState(): NgxsEntityCollections<V, K> {
        return this.ctx.getState();
    }

    public selectId(entity: V): K {
        return (entity as Any)?.[this.primaryKey];
    }

    public selectOne(id: K): V | null {
        return this.snapshot.entities[id] ?? null;
    }

    public selectAll(): V[] {
        const state: NgxsEntityCollections<V, K> = this.getState();
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

        if (isNullOrUndefined(this.comparator)) {
            console.warn(NGXS_DATA_EXCEPTIONS.NGXS_COMPARE);
            return;
        }

        this.setEntitiesState(this.getState());
    }

    protected addEntityOne(entity: V): void {
        const state: NgxsEntityCollections<V, K> = this.getState();
        const id: K = this.selectIdValue(entity);

        if (id in state.entities) {
            return;
        }

        this.setEntitiesState({
            ids: [...state.ids, id],
            entities: { ...state.entities, [id]: entity }
        });
    }

    protected addEntitiesMany(entities: V[]): void {
        const state: NgxsEntityCollections<V, K> = this.getState();
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
                ids: [...state.ids, ...ids],
                entities: { ...state.entities, ...dictionary }
            });
        }
    }

    protected setEntitiesAll(entities: V[]): void {
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

        this.setEntitiesState({ ids, entities: dictionary as EntityDictionary<K, V> });
    }

    protected setEntityOne(entity: V): void {
        const state: NgxsEntityCollections<V, K> = this.getState();
        const id: K = this.selectIdValue(entity);

        if (id in state.entities) {
            this.setEntitiesState({ ...state, entities: { ...state.entities, [id]: entity } });
        } else {
            this.setEntitiesState({ ids: [...state.ids, id], entities: { ...state.entities, [id]: entity } });
        }
    }

    protected setEntitiesMany(entities: V[]): void {
        for (const entity of entities) {
            this.setEntityOne(entity);
        }
    }

    protected updateEntitiesMany(updates: EntityUpdate<V, K>[]): void {
        const state: NgxsEntityCollections<V, K> = this.getState();
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

        this.setEntitiesState({ ids: state.ids.map((id: K): K => keys[id] ?? id), entities });
    }

    protected upsertEntitiesMany(entities: V[]): void {
        const state: NgxsEntityCollections<V, K> = this.getState();
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
        const state: NgxsEntityCollections<V, K> = this.getState();
        const keys: KeysDictionary<K> = this.generateKeyMap(state);
        const entities: EntityDictionary<K, V> = { ...state.entities };

        for (const id of ids) {
            if (id in entities) {
                delete keys[id];
                delete entities[id];
            }
        }

        this.setEntitiesState({ ids: state.ids.filter((id: K): boolean => id in keys), entities });
    }

    protected setEntitiesState(state: NgxsEntityCollections<V, K>): void {
        const ids: K[] = this.sortKeysByComparator(state.ids, state.entities);
        this.ctx.setState({ ids, entities: state.entities });
    }

    protected sortKeysByComparator(originalIds: K[], entities: EntityDictionary<K, V>): K[] {
        if (isNullOrUndefined(this.comparator)) {
            return originalIds;
        }

        const ids: K[] = originalIds.slice();
        const comparator: EntityComparator<V> = this.comparator!;

        if (typeof comparator === 'function') {
            return ids.sort((a: K, b: K): number => comparator(entities[a] as V, entities[b] as V));
        }

        return this.sortByComparatorOptions(ids, comparator, entities);
    }

    private sortByComparatorOptions(ids: K[], comparator: EntitySortBy<V>, entities: EntityDictionary<K, V>): K[] {
        switch (comparator?.sortByOrder) {
            case EntitySortByOrder.ASC:
                return ids.sort((a: K, b: K): number =>
                    entitySortByAsc(comparator?.sortBy, entities[a] as V, entities[b] as V)
                );
            case EntitySortByOrder.DESC:
                return ids.sort((a: K, b: K): number =>
                    entitySortByDesc(comparator?.sortBy, entities[a] as V, entities[b] as V)
                );
            default:
                if (isDevMode()) {
                    console.warn(`Invalid --> { sortByOrder: "${comparator?.sortByOrder}" } not supported!`);
                }

                return ids;
        }
    }

    private generateKeyMap(state: NgxsEntityCollections<V, K>): KeysDictionary<K> {
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
        const invalidId: boolean = isNullOrUndefined(id) && isDevMode();

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
