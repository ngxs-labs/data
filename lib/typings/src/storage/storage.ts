import { Type } from '@angular/core';
import { Any, PlainObject } from '@angular-ru/common/typings';
import { ActionType, Store } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import { Subject, Subscription } from 'rxjs';

import { NgxsRepositoryMeta } from '../common/repository';

export interface DataStorage<T = string, U = string> {
    getItem(key: string): T;

    setItem(key: string, val: U): void;

    removeItem(key: string): void;

    clear(): void;
}

export const enum StorageDecodeType {
    BASE64 = 'base64',
    NONE = 'none'
}

export const enum TtlExpiredStrategy {
    REMOVE_KEY_AFTER_EXPIRED,
    SET_NULL_DATA_AFTER_EXPIRED,
    DO_NOTHING_AFTER_EXPIRED
}

interface CommonPersistenceProvider {
    /**
     * Path for slice
     * default: state.name
     */
    path?: string | null;

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
     * The time, in milliseconds (thousandths of a second),
     * the timer should delay in between checking for expiration time live.
     * default: 60000ms (1min)
     */
    ttlDelay?: number;

    /**
     *
     */
    ttlExpiredStrategy?: TtlExpiredStrategy;

    /**
     * decode/encoded
     * default: STORAGE_DECODE_TYPE.NONE
     */
    decode?: StorageDecodeType;

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

    /**
     * sync storage from state after init
     * default: true
     */
    fireInit?: boolean;

    /**
     * Pull initial state from storage on startup
     * default: true
     */
    rehydrate?: boolean;

    /**
     * default: current state instance
     */
    stateInstance?: StateClass;

    /**
     * default: reference to state class
     */
    stateClassRef?: Type<StateClass>;

    /**
     * function that accepts a state and expects the new state in return.
     * defaults: undefined
     */
    migrate?: MigrateFn;

    /**
     * skip key migration,
     * default: false
     */
    skipMigrate?: boolean;
}

export type MigrateFn<T = Any, R = Any> = ((defaults: T, storage: R) => T) | undefined;

export type ExistingStorageEngine = DataStorage | Storage;

export interface ExistingEngineProvider extends CommonPersistenceProvider {
    /**
     * Storage container
     * default: window.localStorage
     */
    existingEngine: ExistingStorageEngine;
}

export interface UseClassEngineProvider extends CommonPersistenceProvider {
    /**
     * Storage class from DI
     */
    useClass: Type<unknown>;
}

export type PersistenceProvider = ExistingEngineProvider | UseClassEngineProvider;

export interface StorageMeta<T> {
    data: StorageData<T>;
    version: number;
    lastChanged: string;
    expiry?: string;
}

export interface StorageContainer<T = Set<PersistenceProvider>, K = string> {
    providers: T;
    keys: Map<K, void>;

    getProvidedKeys(): string[];
}

export interface DataStoragePlugin {
    readonly size: number;
    readonly store: Store | null;
    readonly providers: Set<PersistenceProvider>;
    readonly entries: IterableIterator<[PersistenceProvider, PersistenceProvider]>;

    serialize(data: Any, provider: PersistenceProvider): string;

    deserialize<T>(meta: StorageMeta<T>, value: string | null, provider: PersistenceProvider): StorageData<T>;

    destroyOldTasks(): void;
}

export type StorageData<T> = T | string | null;

export interface GlobalStorageOptionsHandler {
    key: string;
    action: ActionType;
    value: string | null;
    engine: ExistingStorageEngine;
    provider: PersistenceProvider;
}

export interface NgxsDataExpiredEvent {
    key: string;
    expiry: string | null | undefined;
    timestamp: string;
}

export interface NgxsDataAfterExpired {
    expired$: Subject<NgxsDataExpiredEvent>;

    ngxsDataAfterExpired?(event: NgxsDataExpiredEvent, provider: PersistenceProvider): void;
}

export interface NgxsDataMigrateStorage<T = unknown, R = unknown> {
    ngxsDataStorageMigrate?(defaults: T, storage: R): T;
}

export interface NgxsDataAfterStorageEvent<T = Any> {
    browserStorageEvents$: Subject<NgxsDataStorageEvent<T>>;
    ngxsDataAfterStorageEvent?(event: NgxsDataStorageEvent<T>): void;
}

export interface NgxsDataStorageEvent<T = Any> {
    provider: PersistenceProvider;
    value: string | null;
    data: T | null;
    key: string;
}

export interface TtlListenerOptions {
    subscription: Subscription;
    startListen: string | null;
    endListen: string | null;
}

export interface TtLCreatorOptions {
    provider: PersistenceProvider;
    expiry: Date | undefined | null;
    map: WeakMap<PersistenceProvider, TtlListenerOptions>;
    engine: ExistingStorageEngine;
}

export interface CreateStorageDefaultOptions {
    prefix: string;
    meta: NgxsRepositoryMeta;
    decodeType: StorageDecodeType;
    stateClassRef: Type<StateClass>;
}

export interface PullFromStorageOptions<T> {
    provider: PersistenceProvider;
    meta: StorageMeta<T>;
    data: T;
}

export interface PullFromStorageInfo {
    canBeOverrideFromStorage: boolean;
    versionMismatch: boolean;
    expiry: Date | null;
    expired: boolean;
}

export interface RehydrateInfoOptions<T> {
    states: PlainObject;
    provider: PersistenceProvider;
    data: T | null;
    info: PullFromStorageInfo;
}

export interface RehydrateInfo {
    states: PlainObject;
    rehydrateIn: boolean;
}

export interface CheckExpiredInitOptions {
    info: PullFromStorageInfo;
    options: GlobalStorageOptionsHandler;
    rehydrateInfo: RehydrateInfo;
    map: WeakMap<PersistenceProvider, TtlListenerOptions>;
}

export type ProviderOptions = PersistenceProvider[] | PersistenceProvider;

export interface MergeOptions {
    meta: NgxsRepositoryMeta;
    option: PersistenceProvider;
    prefix: string;
    decodeType: StorageDecodeType;
    stateClassRef: Type<StateClass>;
}

export interface PullStorageMeta {
    init: boolean;
    action: ActionType;
}
