import { ActionOptions, ActionType } from '@ngxs/store';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import { Any, PlainObjectOf } from '@ngxs-labs/data/internals';
import { Immutable } from '@ngxs-labs/data/common';
import { Observable } from 'rxjs';
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
