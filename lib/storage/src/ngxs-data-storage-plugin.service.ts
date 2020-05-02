import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, Injector, PLATFORM_ID, Self } from '@angular/core';
import { isNotNil } from '@ngxs-labs/data/internals';
import { NGXS_DATA_STORAGE_EVENT_TYPE } from '@ngxs-labs/data/tokens';
import {
    Any,
    CheckExpiredInitOptions,
    DataStoragePlugin,
    ExistingStorageEngine,
    GlobalStorageOptionsHandler,
    PersistenceProvider,
    PullFromStorageInfo,
    RehydrateInfo,
    StorageContainer,
    StorageMeta,
    TtlListenerOptions
} from '@ngxs-labs/data/typings';
import { ActionType, getValue, NgxsNextPluginFn, NgxsPlugin, Store } from '@ngxs/store';
import { PlainObject } from '@ngxs/store/internals';
import { fromEvent, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NGXS_DATA_STORAGE_CONTAINER_TOKEN } from './tokens/storage-container-token';
import { canBePullFromStorage } from './utils/can-be-pull-from-storage';
import { createTtlInterval } from './utils/create-ttl-interval';
import { deserializeByStorageMeta } from './utils/deserialize-by-storage-meta';
import { ensureKey } from './utils/ensure-key';
import { existTtl } from './utils/exist-ttl';
import { exposeEngine } from './utils/expose-engine';
import { firedStateWhenExpired } from './utils/fire-state-when-expired';
import { isInitAction } from './utils/is-init-action';
import { parseStorageMeta } from './utils/parse-storage-meta';
import { rehydrate } from './utils/rehydrate';
import { silentDeserializeWarning } from './utils/silent-deserialize-warning';
import { silentSerializeWarning } from './utils/silent-serialize-warning';

@Injectable()
export class NgxsDataStoragePlugin implements NgxsPlugin, DataStoragePlugin {
    public static injector: Injector | null = null;
    private static eventsSubscriptions: Subscription | null = null;
    private static ttlListeners: WeakMap<PersistenceProvider, TtlListenerOptions> = new WeakMap();

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

    public get ttlListeners(): WeakMap<PersistenceProvider, TtlListenerOptions> {
        return NgxsDataStoragePlugin.ttlListeners;
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
        states = this.pullStateFromStorage(states, action, init);

        return next(states, action).pipe(
            tap((nextState: PlainObject): void => this.pushStateToStorage(states, nextState, init))
        );
    }

    public serialize<T>(data: T, provider: PersistenceProvider): string {
        const meta: StorageMeta<T> = {
            lastChanged: new Date().toISOString(),
            version: provider.version!,
            data: isNotNil(data) ? data : null
        };

        if (existTtl(provider)) {
            const engine: ExistingStorageEngine = exposeEngine(provider, NgxsDataStoragePlugin.injector!);
            const expiry: Date = new Date(Date.now() + parseInt(provider.ttl as Any));
            createTtlInterval({ provider, expiry, map: this.ttlListeners, engine });
            meta.expiry = expiry.toISOString();
        }

        return JSON.stringify(meta);
    }

    public deserialize<T>(meta: StorageMeta<T>, value: string | null): T | null {
        return deserializeByStorageMeta(meta, value);
    }

    public destroyOldTasks(): void {
        NgxsDataStoragePlugin.eventsSubscriptions?.unsubscribe();
        NgxsDataStoragePlugin.ttlListeners = new WeakMap();
    }

    private pushStateToStorage(states: PlainObject, nextState: PlainObject, init: boolean): void {
        for (const [provider] of this.entries) {
            const prevData: Any = getValue(states, provider.path!);
            const newData: Any = getValue(nextState, provider.path!);
            const canBeInitFire: boolean = provider.fireInit! && init;

            if (prevData !== newData || canBeInitFire) {
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

    private pullStateFromStorage(states: PlainObject, action: ActionType, init: boolean): PlainObject {
        if (this.canBeSyncStoreWithStorage(action, init)) {
            for (const [provider] of this.entries) {
                states = this.deserializeByProvider(states, provider);
            }
        }

        return states;
    }

    private canBeSyncStoreWithStorage(action: ActionType, init: boolean): boolean {
        return this.size > 0 && (init || action.type === NGXS_DATA_STORAGE_EVENT_TYPE);
    }

    private deserializeByProvider(states: PlainObject, provider: PersistenceProvider): PlainObject {
        const key: string = ensureKey(provider);
        const engine: ExistingStorageEngine = exposeEngine(provider, NgxsDataStoragePlugin.injector!);
        const value: string | null = engine.getItem(key);
        const existValueByKeyInStorage: boolean = isNotNil(value);

        if (existValueByKeyInStorage) {
            states = this.deserializeHandler(states, { key, engine, provider, value });
        }

        return states;
    }

    private deserializeHandler<T>(states: PlainObject, options: GlobalStorageOptionsHandler): PlainObject | never {
        const { key, provider, value }: GlobalStorageOptionsHandler = options;
        try {
            const meta: StorageMeta<T> = parseStorageMeta<T>(value);
            const data: T | null = this.deserialize(meta, value);
            const info: PullFromStorageInfo = canBePullFromStorage({ provider, meta, data });

            if (info.canBeOverrideFromStorage) {
                const rehydrateInfo: RehydrateInfo = rehydrate(states, provider, data);
                this.keys.set(key);
                states = rehydrateInfo.states;
                this.checkExpiredInit({ info, rehydrateInfo, options });
            } else {
                this.removeKeyWhenPullInvalid(info, options);
            }
        } catch (error) {
            silentDeserializeWarning(key, value, error.message);
        }

        return states;
    }

    private checkExpiredInit(params: CheckExpiredInitOptions): void {
        const { info, rehydrateInfo, options }: CheckExpiredInitOptions = params;
        const { provider, engine }: GlobalStorageOptionsHandler = options;

        if (rehydrateInfo.rehydrateIn && info.expiry) {
            createTtlInterval({ provider, expiry: info.expiry, map: this.ttlListeners, engine });
        }
    }

    private removeKeyWhenPullInvalid(info: PullFromStorageInfo, options: GlobalStorageOptionsHandler): void {
        const { key, engine, provider }: GlobalStorageOptionsHandler = options;

        if (info.expired) {
            firedStateWhenExpired(key, { provider, engine, map: this.ttlListeners, expiry: info.expiry! });
        }

        engine.removeItem(key);
        this.keys.delete(key);
    }

    private listenWindowEvents(): void {
        if (isPlatformServer(this._platformId)) {
            return;
        }

        this.destroyOldTasks();

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
