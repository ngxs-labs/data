import { ActionOptions, ActionType } from '@ngxs/store';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import { Observable } from 'rxjs';

import { Any, PlainObjectOf } from './internal.interface';
import { Type } from '@angular/core';

/**
 * @publicApi
 */
export interface RepositoryActionOptions extends ActionOptions {
    type?: string | null;
    async?: boolean;
    debounce?: number;
}

/**
 * @publicApi
 */
export interface NgxsDataOperation {
    type: string;
    argumentsNames: string[];
    options: ActionOptions;
}

/**
 * @publicApi
 */
export interface NgxsRepositoryMeta<T = Any> {
    stateMeta?: MetaDataModel;
    operations?: PlainObjectOf<NgxsDataOperation>;
}

/**
 * @publicApi
 */
export type Primitive = undefined | null | boolean | string | number | Function;

/**
 * @publicApi
 */
export interface DeepImmutableArray<T> extends ReadonlyArray<Immutable<T>> {}

/**
 * @publicApi
 */
export interface DeepImmutableMap<K, V> extends ReadonlyMap<Immutable<K>, Immutable<V>> {}

/**
 * @publicApi
 */
export type DeepImmutableObject<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
};

/**
 * @publicApi
 */
export type ActionEvent = ActionType & { payload: PlainObjectOf<Any> };

/**
 * @publicApi
 */
export type Immutable<T> = T extends Primitive
    ? T
    : T extends Array<infer U>
    ? DeepImmutableArray<U>
    : T extends Map<infer K, infer V>
    ? DeepImmutableMap<K, V>
    : T extends object
    ? DeepImmutableObject<T>
    : unknown;

/**
 * @publicApi
 */
export type Mutable<T> = T extends Array<infer U> | ReadonlyArray<infer U>
    ? DeepMutableArray<U>
    : T extends object
    ? { -readonly [P in keyof T]: Mutable<T[P]> }
    : T;

/**
 * @publicApi
 */
export type DeepMutableArray<T> = T extends ReadonlyArray<infer U>
    ? Array<{ [P in keyof T]: Mutable<T> }[keyof T]>
    : Array<{ -readonly [P in keyof T]: Mutable<T[P]> }>;

/**
 * @publicApi
 */
export interface DataRepository<T> {
    name: string;
    initialState: Immutable<T>;
    state$: Observable<Immutable<T>>;

    getState(): Immutable<T>;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;

    patchState(val: Partial<T | Immutable<T>>): void;

    setState(stateValue: StateValue<T>): void;

    reset(): void;
}

/**
 * @publicApi
 */
export type DataPatchValue<T> = Partial<T | Immutable<T>>;

/**
 * @publicApi
 */
export type StateValue<T> = T | Immutable<T> | ((state: Immutable<T>) => Immutable<T> | T);

/**
 * @publicApi
 */
export interface ImmutableStateContext<T> {
    getState(): Immutable<T>;

    setState(val: StateValue<T>): void;

    patchState(val: DataPatchValue<T>): void;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;
}

/**
 * @publicApi
 */
export interface DataStorageEngine {
    readonly length: number;

    key(index: number): string | null;

    getItem<T>(key: string): T;

    getItem(key: string): string | null;

    setItem<T>(key: string, val: T): void;

    setItem(key: string, value: string): void;

    removeItem(key: string): void;

    clear(): void;
}

/**
 * @publicApi
 */
interface CommonPersistenceProvider {
    /**
     * Path for slice
     * default: state.name
     */
    path: string;
    /**
     * Version for next migrate
     * default: 1
     */
    version?: number;
    /**
     * Time to live in ms
     * default: -1
     */
    ttl?: number;

    /**
     * decode/encoded
     */
    decode?: 'base64' | 'none';

    /**
     * prefix for key
     * default: '@ngxs.store.'
     */
    prefixKey?: string;

    /**
     * sync with null value from storage
     * default: false
     */
    nullable?: boolean;
}

/**
 * @publicApi
 */
export interface ExistingEngineProvider extends CommonPersistenceProvider {
    /**
     * Storage container
     * default: window.localStorage
     */
    existingEngine: DataStorageEngine;
}

/**
 * @publicApi
 */
export interface UseClassEngineProvider extends CommonPersistenceProvider {
    /**
     * Storage class from DI
     */
    useClass: Type<unknown>;
}

/**
 * @publicApi
 */
export type PersistenceProvider = ExistingEngineProvider | UseClassEngineProvider;

/**
 * @publicApi
 */
export interface StorageMeta<T = string> {
    lastChanged: string;
    data: T;
    version: number;
}

/**
 * @publicApi
 */
export const NEED_SYNC_TYPE_ACTION: string = 'NEED_SYNC_WITH_STORAGE';
