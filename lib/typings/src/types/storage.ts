import { Type } from '@angular/core';
import { Store } from '@ngxs/store';

import { Any } from './any';

/**
 * @publicApi
 */
export interface DataStorage<T = string, U = string> {
    getItem(key: string): T;

    setItem(key: string, val: U): void;

    removeItem(key: string): void;

    clear(): void;
}

export type DecodingType = 'base64' | 'none';

/**
 * @publicApi
 */
interface CommonPersistenceProvider {
    /**
     * Path for slice
     * default: state.name
     */
    path?: string;
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
    decode?: DecodingType;

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

export type ExistingStorageEngine = DataStorage | Storage;

/**
 * @publicApi
 */
export interface ExistingEngineProvider extends CommonPersistenceProvider {
    /**
     * Storage container
     * default: window.localStorage
     */
    existingEngine: ExistingStorageEngine;
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
export interface StorageContainer<T = Set<PersistenceProvider>, K = string> {
    providers: T;
    keys: Map<K, void>;

    getProvidedKeys(): string[];
}

/**
 * @privateApi
 */
export interface RootInternalStorageEngine {
    readonly size: number;
    readonly store: Store | null;
    readonly providers: Set<PersistenceProvider>;
    readonly entries: IterableIterator<[PersistenceProvider, PersistenceProvider]>;

    serialize(data: Any, provider: PersistenceProvider): string;

    deserialize(value: string | null): string | null;
}
