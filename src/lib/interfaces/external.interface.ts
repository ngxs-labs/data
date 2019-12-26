import { ActionOptions, ActionType } from '@ngxs/store';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import { Observable } from 'rxjs';

import {
    Any,
    DeepImmutableArray,
    DeepImmutableMap,
    DeepImmutableObject,
    PlainObjectOf,
    Primitive
} from './internal.interface';
import { Type } from '@angular/core';

export const NGXS_DATA_META: string = 'NGXS_DATA_META';

export interface RepositoryActionOptions extends ActionOptions {
    type?: string | null;
    async?: boolean;
    debounce?: number;
}

export interface NgxsDataOperation {
    type: string;
    argumentsNames: string[];
    options: ActionOptions;
}

export interface NgxsRepositoryMeta<T = Any> {
    stateMeta?: MetaDataModel;
    operations?: PlainObjectOf<NgxsDataOperation>;
}

export type Immutable<T> = T extends Primitive
    ? T
    : T extends Array<infer U>
    ? DeepImmutableArray<U>
    : T extends Map<infer K, infer V>
    ? DeepImmutableMap<K, V>
    : T extends object
    ? DeepImmutableObject<T>
    : unknown;

export interface DataRepository<T> {
    name: string;
    initialState: Immutable<T>;
    state$: Observable<Immutable<T>>;
}

export type DataPatchValue<T> = Partial<T | Immutable<T>>;

export type StateValue<T> = T | Immutable<T> | ((state: Immutable<T>) => Immutable<T> | T);

export interface ImmutableStateContext<T> {
    getState(): Immutable<T>;

    setState(val: StateValue<T>): void;

    patchState(val: DataPatchValue<T>): void;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;
}

export enum NGXS_DATA_EXCEPTIONS {
    NGXS_PERSISTENCE_STATE = '@Persistence should be add before decorator @State and @StateRepository',
    NGXS_DATA_STATE = '@StateRepository should be add before decorator @State',
    NGXS_DATA_MODULE_EXCEPTION = 'Metadata not created \n Maybe you forgot to import the NgxsDataPluginModule' +
        '\n Also, you cannot use this.ctx.* until the application is fully rendered ' +
        '\n (use by default ngxsOnInit(ctx: StateContext), or ngxsAfterBootstrap(ctx: StateContext) !!!',
    NGXS_DATA_STATE_DECORATOR = 'You forgot add decorator @StateRepository or initialize state!' +
        '\n Example: NgxsModule.forRoot([ .. ]), or NgxsModule.forFeature([ .. ])',
    NGXS_DATA_STATIC_ACTION = 'Cannot support static methods with @action',
    NGXS_DATA_ACTION = '@action can only decorate a method implementation',
    NGXS_DATA_ACTION_RETURN_TYPE = 'RECOMMENDATION: If you use asynchronous actions' +
        ' `@action({ async: true })`, ' +
        'the return result type should only be Observable or void instead',
    NGXS_PERSISTENCE_ENGINE = 'Not declare storage engine in `existingEngine` or not found after injecting by `useClass`',
    NGXS_PERSISTENCE_SERIALIZE = 'Error occurred while serializing the store value, value not updated.',
    NGXS_PERSISTENCE_DESERIALIZE = 'Error occurred while deserializing the store value, falling back to empty object.'
}

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

export interface ExistingEngineProvider extends CommonPersistenceProvider {
    /**
     * Storage container
     * default: window.localStorage
     */
    existingEngine: DataStorageEngine;
}

export interface UseClassEngineProvider extends CommonPersistenceProvider {
    /**
     * Storage class from DI
     */
    useClass: Type<unknown>;
}

export type PersistenceProvider = ExistingEngineProvider | UseClassEngineProvider;

export interface StorageMeta<T = string> {
    lastChanged: string;
    data: T;
    version: number;
}

export const NEED_SYNC_TYPE_ACTION: string = 'NEED_SYNC_WITH_STORAGE';
