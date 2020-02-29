import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, Injector, PLATFORM_ID, Self } from '@angular/core';
import { isNotNil } from '@ngxs-labs/data/internals';
import { NEED_SYNC_TYPE_ACTION, NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import {
    Any,
    DataStorageEngine,
    ExistingEngineProvider,
    PersistenceProvider,
    RootInternalStorageEngine,
    StorageContainer,
    StorageMeta,
    UseClassEngineProvider
} from '@ngxs-labs/data/typings';
import {
    actionMatcher,
    ActionType,
    getValue,
    InitState,
    NgxsNextPluginFn,
    NgxsPlugin,
    setValue,
    Store,
    UpdateState
} from '@ngxs/store';
import { PlainObject } from '@ngxs/store/internals';
import { fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NGXS_DATA_STORAGE_CONTAINER_TOKEN } from './tokens/ngxs-data-storage-container';

@Injectable()
export class NgxsDataStoragePlugin implements NgxsPlugin, RootInternalStorageEngine {
    public static injector: Injector | null = null;

    constructor(@Inject(PLATFORM_ID) private _platformId: string, @Self() injector: Injector) {
        NgxsDataStoragePlugin.injector = injector;
        this.listenWindowEvents();
    }

    public get store(): Store | null {
        return NgxsDataStoragePlugin.injector!.get(Store, null);
    }

    public get size(): number {
        return this.providers.size;
    }

    public get container(): StorageContainer | never {
        let container: StorageContainer;

        try {
            container = NgxsDataStoragePlugin.injector?.get(NGXS_DATA_STORAGE_CONTAINER_TOKEN)!;
        } catch (e) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_CONTAINER);
        }

        return container!;
    }

    public get providers(): Set<PersistenceProvider> {
        return this.container.providers;
    }

    public get keys(): Map<string, void> {
        return this.container.keys;
    }

    public get entries(): IterableIterator<[PersistenceProvider, PersistenceProvider]> {
        return this.providers.entries();
    }

    private static exposeEngine(provider: PersistenceProvider): DataStorageEngine {
        const engine: DataStorageEngine | null | undefined =
            (provider as ExistingEngineProvider).existingEngine ||
            NgxsDataStoragePlugin.injector!.get<DataStorageEngine>(
                ((provider as UseClassEngineProvider).useClass as Any)!,
                null!
            );

        if (!engine) {
            throw new Error(`${NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_ENGINE}:::${provider.path}`);
        }

        return engine;
    }

    public handle(states: PlainObject, action: ActionType, next: NgxsNextPluginFn): NgxsNextPluginFn {
        if (this.size === 0 || isPlatformServer(this._platformId)) {
            return next(states, action);
        }

        const matches: (action: ActionType) => boolean = actionMatcher(action);
        const isInitAction: boolean = matches(InitState) || matches(UpdateState);
        const canBeSyncStoreWithStorage: boolean =
            this.size > 0 && (isInitAction || action.type === NEED_SYNC_TYPE_ACTION);

        if (canBeSyncStoreWithStorage) {
            for (const [provider] of this.entries) {
                const engine: DataStorageEngine = NgxsDataStoragePlugin.exposeEngine(provider);
                const key: string = this.ensureKey(provider);
                const value: string | undefined = engine.getItem(key);
                if (isNotNil(value)) {
                    try {
                        const data: string | undefined | null = this.deserialize(value);
                        if (isNotNil(data) || provider.nullable) {
                            this.keys.set(key);
                            states = setValue(states, provider.path, data);
                        } else {
                            engine.removeItem(key);
                            this.keys.delete(key);
                        }
                    } catch {
                        console.error(`${NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_DESERIALIZE}:::${provider.path}`);
                    }
                }
            }
        }

        return next(states, action).pipe(
            tap((nextState) => {
                for (const [provider] of this.entries) {
                    const prevData: Any = getValue(states, provider.path);
                    const newData: Any = getValue(nextState, provider.path);
                    if (prevData !== newData || isInitAction) {
                        const engine: DataStorageEngine = NgxsDataStoragePlugin.exposeEngine(provider);

                        try {
                            const data: Any = this.serialize(newData, provider);
                            const key: string = this.ensureKey(provider);
                            engine.setItem(key, data);
                            this.keys.set(key);
                        } catch (e) {
                            console.error(`${NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_SERIALIZE}:::${provider.path}`);
                        }
                    }
                }
            })
        );
    }

    public serialize(data: Any, provider: PersistenceProvider): string {
        return JSON.stringify({
            lastChanged: new Date().toISOString(),
            version: provider.version,
            data: isNotNil(data) ? data : null
        });
    }

    public deserialize(value: string | undefined): string | undefined {
        const meta: StorageMeta = JSON.parse(value!);
        if (meta.lastChanged) {
            return meta.data;
        } else {
            throw new Error('Not found lastChanged in meta');
        }
    }

    public ensureKey(provider: PersistenceProvider): string {
        return `${provider.prefixKey}${provider.path}`;
    }

    private listenWindowEvents(): void {
        if (!isPlatformServer(this._platformId)) {
            fromEvent(window, 'storage').subscribe((event: Any) => {
                if (this.keys.has((event as StorageEvent).key!)) {
                    this.store!.dispatch({ type: NEED_SYNC_TYPE_ACTION });
                }
            });
        }
    }
}
