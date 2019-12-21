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

import { Any } from '../interfaces/internal.interface';
import {
    NGXS_DATA_EXCEPTIONS,
    PersistenceProvider,
    DataStorageEngine,
    StorageMeta,
    UseClassEngineProvider,
    ExistingEngineProvider
} from '../interfaces/external.interface';
import { isNotNil } from '../internals/utils';

const NEED_SYNC_TYPE_ACTION: string = 'NEED_SYNC_WITH_STORAGE';

@Injectable()
export class NgxsDataStorageEngine implements NgxsPlugin {
    public static providers: Set<PersistenceProvider> = new Set();

    constructor(@Inject(PLATFORM_ID) private _platformId: string, private injector: Injector) {
        if (!isPlatformServer(this._platformId)) {
            fromEvent(window, 'storage').subscribe(() => {
                if (this.providers.size > 0 && this.store) {
                    const store: Store | null = this.store;
                    store.dispatch({ type: NEED_SYNC_TYPE_ACTION });
                }
            });
        }
    }

    private get store(): Store | null {
        return this.injector.get(Store, null);
    }

    private get size(): number {
        return this.providers.size;
    }

    private get providers(): Set<PersistenceProvider> {
        return NgxsDataStorageEngine.providers;
    }

    private get entries(): IterableIterator<[PersistenceProvider, PersistenceProvider]> {
        return this.providers.entries();
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
                const key: string = `${provider.prefixKey}${provider.path}`;
                const value: string | undefined = engine.getItem(key);
                if (isNotNil(value)) {
                    try {
                        const data: string | undefined | null = this.deserialize(value);
                        if (isNotNil(data) || provider.nullable) {
                            states = setValue(states, provider.path, data);
                        } else {
                            engine.removeItem(key);
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
                            engine.setItem(`${provider.prefixKey}${provider.path}`, data);
                        } catch (e) {
                            console.error(`${NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_SERIALIZE}:::${provider.path}`);
                        }
                    }
                }
            })
        );
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

    private serialize(data: Any, provider: PersistenceProvider): string {
        return JSON.stringify({
            lastChanged: new Date().toISOString(),
            version: provider.version,
            data: isNotNil(data) ? data : null
        });
    }

    private deserialize(value: string | undefined): string | undefined {
        const meta: StorageMeta = JSON.parse(value!);
        if (meta.lastChanged) {
            return meta.data;
        } else {
            throw new Error('Not found lastChanged in meta');
        }
    }
}
