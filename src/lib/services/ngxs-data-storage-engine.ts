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
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { PlainObject } from '@ngxs/store/internals';
import { tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

import { Any, RootInternalStorageEngine } from '../interfaces/internal.interface';
import {
    DataStorageEngine,
    ExistingEngineProvider,
    NEED_SYNC_TYPE_ACTION,
    NGXS_DATA_EXCEPTIONS,
    PersistenceProvider,
    StorageMeta,
    UseClassEngineProvider
} from '../interfaces/external.interface';
import { isNotNil } from '../internals/utils';

/**
 * @privateApi
 */
@Injectable()
export class NgxsDataStorageEngine implements NgxsPlugin, RootInternalStorageEngine {
    public static providers: Set<PersistenceProvider> = new Set();
    private static keys: Map<string, void> = new Map();

    constructor(@Inject(PLATFORM_ID) private _platformId: string, private injector: Injector) {
        if (!isPlatformServer(this._platformId)) {
            fromEvent(window, 'storage').subscribe((event: Any) => {
                if (NgxsDataStorageEngine.keys.has((event as StorageEvent).key!)) {
                    this.store!.dispatch({ type: NEED_SYNC_TYPE_ACTION });
                }
            });
        }
    }

    public get store(): Store | null {
        return this.injector.get(Store, null);
    }

    public get size(): number {
        return this.providers.size;
    }

    public get providers(): Set<PersistenceProvider> {
        return NgxsDataStorageEngine.providers;
    }

    public get entries(): IterableIterator<[PersistenceProvider, PersistenceProvider]> {
        return this.providers.entries();
    }

    public static getProvidedKeys(): string[] {
        return Array.from(NgxsDataStorageEngine.keys.keys());
    }

    public static clear(): void {
        NgxsDataStorageEngine.keys.clear();
        NgxsDataStorageEngine.providers.clear();
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
                const engine: DataStorageEngine = this.exposeEngine(provider);
                const key: string = this.ensureKey(provider);
                const value: string | undefined = engine.getItem(key);
                if (isNotNil(value)) {
                    try {
                        const data: string | undefined | null = this.deserialize(value);
                        if (isNotNil(data) || provider.nullable) {
                            NgxsDataStorageEngine.keys.set(key);
                            states = setValue(states, provider.path, data);
                        } else {
                            engine.removeItem(key);
                            NgxsDataStorageEngine.keys.delete(key);
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
                        const engine: DataStorageEngine = this.exposeEngine(provider);

                        try {
                            const data: Any = this.serialize(newData, provider);
                            const key: string = this.ensureKey(provider);
                            engine.setItem(key, data);
                            NgxsDataStorageEngine.keys.set(key);
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

    private exposeEngine(provider: PersistenceProvider): DataStorageEngine {
        const engine: DataStorageEngine | null | undefined =
            (provider as ExistingEngineProvider).existingEngine ||
            this.injector.get<DataStorageEngine>(((provider as UseClassEngineProvider).useClass as Any)!, null!);

        if (!engine) {
            throw new Error(`${NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_ENGINE}:::${provider.path}`);
        }

        return engine;
    }
}
