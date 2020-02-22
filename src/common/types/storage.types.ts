import { Type } from '@angular/core';
import { Any } from '@ngxs-labs/data/internals';
import { Store } from '@ngxs/store';

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
 * @privateApi
 */
export interface RootInternalStorageEngine {
    readonly size: number;
    readonly store: Store | null;
    readonly providers: Set<PersistenceProvider>;
    readonly entries: IterableIterator<[PersistenceProvider, PersistenceProvider]>;

    serialize(data: Any, provider: PersistenceProvider): string;

    deserialize(value: string | undefined): string | undefined;

    ensureKey(provider: PersistenceProvider): string;
}
