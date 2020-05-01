import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, Injector, PLATFORM_ID, Self } from '@angular/core';
import { isNotNil } from '@ngxs-labs/data/internals';
import { NGXS_DATA_STORAGE_EVENT_TYPE } from '@ngxs-labs/data/tokens';
import {
    Any,
    ExistingStorageEngine,
    GlobalStorageOptionsHandler,
    PersistenceProvider,
    RootInternalStorageEngine,
    StorageContainer,
    StorageMeta
} from '@ngxs-labs/data/typings';
import { ActionType, getValue, NgxsNextPluginFn, NgxsPlugin, setValue, Store } from '@ngxs/store';
import { PlainObject } from '@ngxs/store/internals';
import { fromEvent, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NGXS_DATA_STORAGE_CONTAINER_TOKEN } from './tokens/storage-container-token';
import { deserializeByStorageMeta } from './utils/deserialize-by-storage-meta';
import { ensureKey } from './utils/ensure-key';
import { exposeEngine } from './utils/expose-engine';
import { isInitAction } from './utils/is-init-action';
import { parseStorageMeta } from './utils/parse-storage-meta';
import { silentDeserializeWarning } from './utils/silent-deserialize-warning';
import { silentSerializeWarning } from './utils/silent-serialize-warning';

@Injectable()
export class NgxsDataStoragePlugin implements NgxsPlugin, RootInternalStorageEngine {
    public static injector: Injector | null = null;
    private static eventsSubscriptions: Subscription | null = null;

    constructor(@Inject(PLATFORM_ID) private readonly _platformId: string, @Self() injector: Injector) {
        NgxsDataStoragePlugin.injector = injector;
        this.listenWindowEvents();
    }

    public get store(): Store | null {
        return NgxsDataStoragePlugin.injector!.get(Store, null);
    }

    public get size(): number {
        return this.providers.size;
    }

    /**
     * @description:
     * The storage container that contains meta information about
     */
    public get container(): StorageContainer {
        return NgxsDataStoragePlugin.injector!.get(NGXS_DATA_STORAGE_CONTAINER_TOKEN);
    }

    /**
     * @description:
     * Meta information about all the added keys and their options
     */
    public get providers(): Set<PersistenceProvider> {
        return this.container.providers;
    }

    /**
     * @description:
     * Keys needed for dynamic synchronization with StorageEvents from
     * localStorage or sessionStorage
     */
    public get keys(): Map<string, void> {
        return this.container.keys;
    }

    public get entries(): IterableIterator<[PersistenceProvider, PersistenceProvider]> {
        return this.providers.entries();
    }

    private get skipStorageInterceptions(): boolean {
        return this.size === 0 || isPlatformServer(this._platformId);
    }

    public handle(states: PlainObject, action: ActionType, next: NgxsNextPluginFn): NgxsNextPluginFn {
        if (this.skipStorageInterceptions) {
            return next(states, action);
        }

        const init: boolean = isInitAction(action);
        states = this.firstSynchronizationWithStorage(states, action, init);

        return next(states, action).pipe(
            tap((nextState: PlainObject): void => this.nextSynchronizationWithStorage(states, nextState, init))
        );
    }

    public serialize(data: Any, provider: PersistenceProvider): string {
        return JSON.stringify({
            lastChanged: new Date().toISOString(),
            version: provider.version,
            data: isNotNil(data) ? data : null
        });
    }

    public deserialize<T>(value: string | null): T | null | never {
        const meta: StorageMeta<T> = parseStorageMeta<T>(value);
        return deserializeByStorageMeta(meta, value);
    }

    private nextSynchronizationWithStorage(states: PlainObject, nextState: PlainObject, init: boolean): void {
        for (const [provider] of this.entries) {
            const prevData: Any = getValue(states, provider.path!);
            const newData: Any = getValue(nextState, provider.path!);
            if (prevData !== newData || init) {
                const engine: ExistingStorageEngine = exposeEngine(provider, NgxsDataStoragePlugin.injector!);
                const key: string = ensureKey(provider);

                try {
                    const data: Any = this.serialize(newData, provider);
                    engine.setItem(key, data);
                    this.keys.set(key);
                } catch (error) {
                    silentSerializeWarning(key, error.message);
                }
            }
        }
    }

    private firstSynchronizationWithStorage(states: PlainObject, action: ActionType, init: boolean): PlainObject {
        if (this.canBeSyncStoreWithStorage(action, init)) {
            for (const [provider] of this.entries) {
                states = this.whenValueExistDeserializeIt(states, provider);
            }
        }

        return states;
    }

    private canBeSyncStoreWithStorage(action: ActionType, init: boolean): boolean {
        return this.size > 0 && (init || action.type === NGXS_DATA_STORAGE_EVENT_TYPE);
    }

    private whenValueExistDeserializeIt(states: PlainObject, provider: PersistenceProvider): PlainObject {
        const key: string = ensureKey(provider);
        const engine: ExistingStorageEngine = exposeEngine(provider, NgxsDataStoragePlugin.injector!);
        const value: string | null = engine.getItem(key);
        const existValueByKeyInStorage: boolean = isNotNil(value);

        if (existValueByKeyInStorage) {
            states = this.globalStorageValueHandle(states, { key, engine, provider, value });
        }

        return states;
    }

    private globalStorageValueHandle<T>(states: PlainObject, options: GlobalStorageOptionsHandler): PlainObject {
        const { key, provider, value, engine }: GlobalStorageOptionsHandler = options;
        try {
            const data: T | undefined | null = this.deserialize<T>(value);
            const canBeOverrideFromStorage: boolean = isNotNil(data) || provider.nullable!;

            if (canBeOverrideFromStorage) {
                this.keys.set(key);

                const prevData: T = getValue(states, provider.path!);
                if (JSON.stringify(prevData) !== JSON.stringify(data)) {
                    states = setValue(states, provider.path!, data);
                }
            } else {
                engine.removeItem(key);
                this.keys.delete(key);
            }
        } catch (error) {
            silentDeserializeWarning(key, value, error.message);
        }

        return states;
    }

    private listenWindowEvents(): void {
        if (isPlatformServer(this._platformId)) {
            return;
        }

        // preserve memory leak when usage static injector
        NgxsDataStoragePlugin.eventsSubscriptions?.unsubscribe();

        NgxsDataStoragePlugin.eventsSubscriptions = fromEvent<StorageEvent>(window, 'storage').subscribe(
            (event: StorageEvent): void => {
                const keyUsageInStore: boolean = !!event.key && this.keys.has(event.key);
                if (keyUsageInStore) {
                    this.store!.dispatch({ type: NGXS_DATA_STORAGE_EVENT_TYPE });
                }
            }
        );
    }
}
