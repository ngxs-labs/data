import { Injectable, PLATFORM_ID } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { DataAction, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository, NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import {
    NGXS_DATA_STORAGE_CONTAINER,
    NGXS_DATA_STORAGE_CONTAINER_TOKEN,
    NGXS_DATA_STORAGE_EXTENSION,
    NGXS_DATA_STORAGE_PLUGIN,
    NGXS_DATA_STORAGE_PREFIX_TOKEN,
    NgxsDataStoragePlugin
} from '@ngxs-labs/data/storage';
import {
    DataStorage,
    NgxsDataAfterExpired,
    NgxsDataAfterStorageEvent,
    NgxsDataExpiredEvent,
    NgxsDataMigrateStorage,
    NgxsDataStorageEvent,
    PersistenceProvider,
    StorageContainer,
    StorageMeta,
    TTL_EXPIRED_STRATEGY,
    STORAGE_DECODE_TYPE
} from '@ngxs-labs/data/typings';
import { Actions, NGXS_PLUGINS, NgxsModule, ofActionDispatched, ofActionSuccessful, State, Store } from '@ngxs/store';
import { NGXS_DATA_EXCEPTIONS, NGXS_DATA_STORAGE_EVENT_TYPE } from '@ngxs-labs/data/tokens';
import { Subject } from 'rxjs';
import { STORAGE_TTL_DELAY } from '../../../lib/storage/src/tokens/storage-ttl-delay';
import { NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN } from '../../../lib/storage/src/tokens/storage-decode-type-token';
import { Any } from '@angular-ru/common/typings';

describe('[TEST]: Storage plugin', () => {
    let store: Store;
    let spy: jest.MockInstance<Any, Any>;

    function ensureStoragePlugin(): NgxsDataStoragePlugin {
        const services: Any[] = TestBed.inject<Any[]>(NGXS_PLUGINS);

        if (services[0] instanceof NgxsDataStoragePlugin) {
            return services[0];
        }

        throw new Error('not found plugin');
    }

    function ensureStorage(storage: Storage): [string, Any][] {
        return Object.entries(storage).map(([key, value]) => [key, JSON.parse(value)]);
    }

    describe('simple API', () => {
        it('it should be work with correct providers', () => {
            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([]), NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN])]
            });

            store = TestBed.inject<Store>(Store);
            const plugin: NgxsDataStoragePlugin = ensureStoragePlugin();

            // noinspection SuspiciousTypeOfGuard
            expect(plugin instanceof NgxsDataStoragePlugin).toEqual(true);
            expect(plugin['_platformId']).toEqual('browser');
            expect(plugin.store === store).toEqual(true);
        });

        xit('@Persistence should be add before decorator @State and @StateRepository', () => {
            let message: string | null = null;

            try {
                @Persistence()
                @State({ name: 'custom', defaults: 'hello world' })
                @Injectable()
                class Invalid extends NgxsImmutableDataRepository<string> {}

                TestBed.configureTestingModule({
                    imports: [NgxsModule.forRoot([Invalid]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
                });
            } catch (e) {
                message = e.message;
            }

            expect(message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_STATE);
        });

        it('dont work when incorrect providers (without NGXS_DATA_STORAGE_CONTAINER)', () => {
            @Persistence()
            @StateRepository()
            @State({ name: 'custom', defaults: 'hello world' })
            @Injectable()
            class CustomState extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([CustomState]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION])
                ]
            });

            let message: string | null = null;

            try {
                const state: CustomState = TestBed.inject(CustomState);
                expect(state.getState()).toBeDefined();
            } catch (e) {
                message = e.message;
            }

            expect(message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_CONTAINER);
        });

        it('dont work when incorrect providers (without NGXS_DATA_STORAGE_EXTENSION)', () => {
            @Persistence()
            @StateRepository()
            @State({ name: 'custom', defaults: 'hello world' })
            @Injectable()
            class CustomState extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([CustomState]), NgxsDataPluginModule.forRoot()]
            });

            let message: string | null = null;

            try {
                const state: CustomState = TestBed.inject(CustomState);
                expect(state.getState()).toBeDefined();
            } catch (e) {
                message = e.message;
            }

            expect(message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_CONTAINER);
        });
    });

    describe('Native (LocalStorage, SessionStorage)', () => {
        it('A stateClass', () => {
            @Persistence()
            @StateRepository()
            @State({ name: 'a', defaults: 0 })
            @Injectable()
            class A extends NgxsImmutableDataRepository<number> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([A]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            store = TestBed.inject<Store>(Store);
            const a: A = TestBed.inject<A>(A);

            const container: StorageContainer = TestBed.inject(NGXS_DATA_STORAGE_CONTAINER_TOKEN);
            expect(container.getProvidedKeys()).toEqual(['@ngxs.store.a']);

            expect(Array.from(container.providers)).toEqual([
                {
                    path: 'a',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    nullable: false,
                    rehydrate: true,
                    fireInit: true,
                    skipMigrate: false,
                    stateInstance: expect.any(A),
                    ttlExpiredStrategy: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
                    ttlDelay: STORAGE_TTL_DELAY
                }
            ]);

            expect(a.getState()).toEqual(0);
            expect(store.snapshot()).toEqual({ a: 0 });
            expect(JSON.parse(localStorage.getItem('@ngxs.store.a')!)).toEqual({
                lastChanged: expect.any(String),
                version: 1,
                data: 0
            });

            const plugin: NgxsDataStoragePlugin = ensureStoragePlugin();

            expect(Array.from(plugin.keys.keys())).toEqual(['@ngxs.store.a']);
            expect(Array.from(plugin.providers)).toEqual([
                {
                    path: 'a',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    fireInit: true,
                    rehydrate: true,
                    skipMigrate: false,
                    nullable: false,
                    stateInstance: expect.any(A),
                    ttlExpiredStrategy: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
                    ttlDelay: STORAGE_TTL_DELAY
                }
            ]);
        });

        it('B stateClass', () => {
            localStorage.setItem(
                '@ngxs.store.b',
                JSON.stringify({
                    lastChanged: expect.any(String),
                    version: 1,
                    data: 50
                })
            );

            @Persistence()
            @StateRepository()
            @State({ name: 'b', defaults: 100 })
            @Injectable()
            class B extends NgxsImmutableDataRepository<number> {
                @DataAction()
                public increment(): B {
                    this.ctx.setState((val) => ++val);
                    return this;
                }
            }

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([B]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            store = TestBed.inject<Store>(Store);
            const b: B = TestBed.inject<B>(B);

            const container: StorageContainer = TestBed.inject(NGXS_DATA_STORAGE_CONTAINER_TOKEN);
            expect(container.getProvidedKeys()).toEqual(['@ngxs.store.b']);

            expect(Array.from(container.providers)).toEqual([
                {
                    path: 'b',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    nullable: false,
                    rehydrate: true,
                    fireInit: true,
                    skipMigrate: false,
                    stateInstance: expect.any(B),
                    ttlExpiredStrategy: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
                    ttlDelay: STORAGE_TTL_DELAY
                }
            ]);

            expect(b.getState()).toEqual(50);
            expect(store.snapshot()).toEqual({ b: 50 });
            expect(JSON.parse(localStorage.getItem('@ngxs.store.b')!)).toEqual({
                lastChanged: expect.any(String),
                version: 1,
                data: 50
            });

            b.increment().increment().increment();

            expect(b.getState()).toEqual(53);
            expect(store.snapshot()).toEqual({ b: 53 });
            expect(JSON.parse(localStorage.getItem('@ngxs.store.b')!)).toEqual({
                lastChanged: expect.any(String),
                version: 1,
                data: 53
            });

            b.reset();

            expect(b.getState()).toEqual(100);
            expect(store.snapshot()).toEqual({ b: 100 });
            expect(JSON.parse(localStorage.getItem('@ngxs.store.b')!)).toEqual({
                lastChanged: expect.any(String),
                version: 1,
                data: 100
            });

            const plugin: NgxsDataStoragePlugin = ensureStoragePlugin();

            expect(Array.from(plugin.keys.keys())).toEqual(['@ngxs.store.b']);
            expect(Array.from(plugin.providers)).toEqual([
                {
                    path: 'b',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    fireInit: true,
                    rehydrate: true,
                    nullable: false,
                    skipMigrate: false,
                    stateInstance: expect.any(B),
                    ttlExpiredStrategy: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
                    ttlDelay: STORAGE_TTL_DELAY
                }
            ]);
        });

        xit('C stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem('@ngxs.store.c', 'invalid');

            @Persistence()
            @StateRepository()
            @State({ name: 'c', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const stateC: C = TestBed.inject<C>(C);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenLastCalledWith(
                "Error occurred while deserializing value from metadata { key: '@ngxs.store.c', value: 'invalid' }. \n" +
                    'Error deserialize: Unexpected token i in JSON at position 0. \n' +
                    'Incorrect structure for deserialization!!! Your structure should be like this: \n' +
                    '{\n' +
                    '    "lastChanged": "2020-01-01T12:00:00.000Z",\n' +
                    '    "data": "{}",\n' +
                    '    "version": 1\n' +
                    '}'
            );

            expect(stateC.getState()).toEqual('DEFAULT_VALUE');
        });

        xit('C1 stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem('@ngxs.store.c1', JSON.stringify(1));

            @Persistence()
            @StateRepository()
            @State({ name: 'c1', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C1 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C1]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const stateC1: C1 = TestBed.inject<C1>(C1);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenLastCalledWith(
                "Error occurred while deserializing value from metadata { key: '@ngxs.store.c1', value: '1' }. \n" +
                    'Error deserialize: "1" not an object. \n' +
                    'Incorrect structure for deserialization!!! Your structure should be like this: \n' +
                    '{\n' +
                    '    "lastChanged": "2020-01-01T12:00:00.000Z",\n' +
                    '    "data": "{}",\n' +
                    '    "version": 1\n' +
                    '}'
            );

            expect(stateC1.getState()).toEqual('DEFAULT_VALUE');
        });

        xit('C2 stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem('@ngxs.store.c2', JSON.stringify({ hello: 'world' }));

            @Persistence()
            @StateRepository()
            @State({ name: 'c2', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C2 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C2]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const stateC2: C2 = TestBed.inject<C2>(C2);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenLastCalledWith(
                'Error occurred while deserializing value from metadata { key: \'@ngxs.store.c2\', value: \'{"hello":"world"}\' }. \n' +
                    'Error deserialize: lastChanged key not found in object {"hello":"world"}.'
            );

            expect(stateC2.getState()).toEqual('DEFAULT_VALUE');
        });

        xit('C3 stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem('@ngxs.store.c3', JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z' }));

            @Persistence()
            @StateRepository()
            @State({ name: 'c3', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C3 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C3]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const stateC3: C3 = TestBed.inject<C3>(C3);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenLastCalledWith(
                'Error occurred while deserializing value from metadata { key: \'@ngxs.store.c3\', value: \'{"lastChanged":"2020-01-01T12:00:00.000Z"}\' }. \n' +
                    "Error deserialize: It's not possible to determine version (undefined), since it must be a integer type and must equal or more than 1."
            );

            expect(stateC3.getState()).toEqual('DEFAULT_VALUE');
        });

        xit('C4 stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem(
                '@ngxs.store.c4',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: '1.5' })
            );

            @Persistence()
            @StateRepository()
            @State({ name: 'c4', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C4 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C4]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const stateC4: C4 = TestBed.inject<C4>(C4);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenLastCalledWith(
                'Error occurred while deserializing value from metadata { key: \'@ngxs.store.c4\', value: \'{"lastChanged":"2020-01-01T12:00:00.000Z","version":"1.5"}\' }. \n' +
                    "Error deserialize: It's not possible to determine version (1.5), since it must be a integer type and must equal or more than 1."
            );

            expect(stateC4.getState()).toEqual('DEFAULT_VALUE');
        });

        xit('C5 stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem(
                '@ngxs.store.c5',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1 })
            );

            @Persistence()
            @StateRepository()
            @State({ name: 'c5', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C5 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C5]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const stateC5: C5 = TestBed.inject<C5>(C5);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenLastCalledWith(
                'Error occurred while deserializing value from metadata { key: \'@ngxs.store.c5\', value: \'{"lastChanged":"2020-01-01T12:00:00.000Z","version":1}\' }. \n' +
                    "Error deserialize: missing key 'data' or it's value not serializable."
            );

            expect(stateC5.getState()).toEqual('DEFAULT_VALUE');
        });

        it('C6 stateClass', () => {
            localStorage.setItem(
                '@myCompany.store.c6',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'cachedValue' })
            );

            @Persistence()
            @StateRepository()
            @State({ name: 'c6', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C6 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([C6]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)],
                providers: [{ provide: NGXS_DATA_STORAGE_PREFIX_TOKEN, useValue: '@myCompany.store.' }]
            });

            const stateC6: C6 = TestBed.inject<C6>(C6);

            expect(stateC6.getState()).toEqual('cachedValue');
        });

        it('C7, C8, C9 stateClass', () => {
            localStorage.setItem(
                '@ngxs.store.c7',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: null })
            );

            localStorage.setItem(
                '@ngxs.store.c8',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: null })
            );

            localStorage.setItem(
                'customer.c9',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'HELLO' })
            );

            @Persistence({ nullable: true, existingEngine: localStorage })
            @StateRepository()
            @State({ name: 'c7', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C7 extends NgxsImmutableDataRepository<string> {}

            @Persistence({ existingEngine: localStorage })
            @StateRepository()
            @State({ name: 'c8', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C8 extends NgxsImmutableDataRepository<string> {}

            @Persistence({ existingEngine: localStorage, prefixKey: 'customer.' })
            @StateRepository()
            @State({ name: 'c9', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C9 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([C7, C8, C9]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            const stateC7: C7 = TestBed.inject<C7>(C7);
            const stateC8: C8 = TestBed.inject<C8>(C8);
            const stateC9: C8 = TestBed.inject<C9>(C9);

            expect(stateC7.getState()).toEqual(null);
            expect(stateC8.getState()).toEqual('DEFAULT_VALUE');
            expect(stateC9.getState()).toEqual('HELLO');

            const plugin: NgxsDataStoragePlugin = ensureStoragePlugin();

            expect(Array.from(plugin.keys.keys()).sort()).toEqual(['@ngxs.store.c7', '@ngxs.store.c8', 'customer.c9']);
            expect(Object.keys(localStorage).sort()).toEqual(['@ngxs.store.c7', '@ngxs.store.c8', 'customer.c9']);

            expect(Array.from(plugin.providers)).toEqual([
                {
                    path: 'c9',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: 'customer.',
                    fireInit: true,
                    rehydrate: true,
                    nullable: false,
                    skipMigrate: false,
                    stateInstance: expect.any(C9),
                    ttlExpiredStrategy: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
                    ttlDelay: STORAGE_TTL_DELAY
                },
                {
                    path: 'c8',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    fireInit: true,
                    rehydrate: true,
                    nullable: false,
                    skipMigrate: false,
                    stateInstance: expect.any(C8),
                    ttlExpiredStrategy: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
                    ttlDelay: STORAGE_TTL_DELAY
                },
                {
                    path: 'c7',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    fireInit: true,
                    rehydrate: true,
                    nullable: true,
                    skipMigrate: false,
                    stateInstance: expect.any(C7),
                    ttlExpiredStrategy: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
                    ttlDelay: STORAGE_TTL_DELAY
                }
            ]);
        });

        it('C10, C11, C12 stateClass', () => {
            localStorage.setItem(
                '@ngxs.store.c10',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: '10' })
            );

            localStorage.setItem(
                '@ngxs.store.c11',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: '11' })
            );

            localStorage.setItem(
                'customer.c12', // set unknown key
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: '12' })
            );

            @Persistence({ existingEngine: localStorage })
            @StateRepository()
            @State({ name: 'c10', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C10 extends NgxsImmutableDataRepository<string> {}

            @Persistence({ existingEngine: localStorage })
            @StateRepository()
            @State({ name: 'c11', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C11 extends NgxsImmutableDataRepository<string> {}

            @Persistence({ existingEngine: localStorage })
            @StateRepository()
            @State({ name: 'c12', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C12 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([C10, C11, C12]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            const stateC10: C10 = TestBed.inject<C10>(C10);
            const stateC11: C11 = TestBed.inject<C11>(C11);
            const stateC12: C12 = TestBed.inject<C12>(C12);

            expect(stateC10.getState()).toEqual('10');
            expect(stateC11.getState()).toEqual('11');
            expect(stateC12.getState()).toEqual('DEFAULT_VALUE');

            const plugin: NgxsDataStoragePlugin = ensureStoragePlugin();

            expect(Array.from(plugin.keys.keys()).sort()).toEqual([
                '@ngxs.store.c10',
                '@ngxs.store.c11',
                '@ngxs.store.c12'
            ]);
            expect(Object.keys(localStorage).sort()).toEqual([
                '@ngxs.store.c10',
                '@ngxs.store.c11',
                '@ngxs.store.c12',
                'customer.c12' // see above
            ]);

            expect(Array.from(plugin.providers)).toEqual([
                {
                    path: 'c12',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    fireInit: true,
                    rehydrate: true,
                    nullable: false,
                    skipMigrate: false,
                    stateInstance: expect.any(C12),
                    ttlExpiredStrategy: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
                    ttlDelay: STORAGE_TTL_DELAY
                },
                {
                    path: 'c11',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    fireInit: true,
                    rehydrate: true,
                    nullable: false,
                    skipMigrate: false,
                    stateInstance: expect.any(C11),
                    ttlExpiredStrategy: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
                    ttlDelay: STORAGE_TTL_DELAY
                },
                {
                    path: 'c10',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    fireInit: true,
                    rehydrate: true,
                    nullable: false,
                    skipMigrate: false,
                    stateInstance: expect.any(C10),
                    ttlExpiredStrategy: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
                    ttlDelay: STORAGE_TTL_DELAY
                }
            ]);

            expect(ensureStorage(localStorage)).toEqual([
                ['@ngxs.store.c10', { lastChanged: expect.any(String), version: 1, data: '10' }],
                ['@ngxs.store.c11', { lastChanged: expect.any(String), version: 1, data: '11' }],
                ['customer.c12', { lastChanged: expect.any(String), version: 1, data: '12' }],
                [
                    '@ngxs.store.c12',
                    {
                        lastChanged: expect.any(String),
                        version: 1,
                        data: 'DEFAULT_VALUE'
                    }
                ]
            ]);
        });

        it('C13 stateClass', () => {
            localStorage.setItem(
                '@ngxs.store.c13',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'VALUE' })
            );

            @Persistence({ existingEngine: {} as Storage })
            @StateRepository()
            @State({ name: 'c13', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C13 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([C13]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            let message: string | null = null;

            try {
                const stateC13: C13 = TestBed.inject<C13>(C13);
                expect(stateC13.getState()).toEqual('VALUE');
            } catch (e) {
                message = e.message;
            }

            expect(message).toEqual('StorageEngine instance should be implemented by DataStorageEngine interface');
        });

        it('C14 stateClass', () => {
            localStorage.setItem(
                '@ngxs.store.c14',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'VALUE' })
            );

            class MyStorage implements DataStorage {
                public readonly length!: number;

                public key(_index: number): string | null {
                    return null!;
                }

                public getItem(_key: string): string {
                    return '';
                }

                public setItem(_key: string, _val: Any): void {
                    // void
                }

                public clear(): void {
                    // void
                }

                public removeItem(_key: string): void {
                    // void
                }
            }

            @Persistence({ useClass: MyStorage })
            @StateRepository()
            @State({ name: 'c14', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C14 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([C14]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            let message: string | null = null;

            try {
                const stateC14: C14 = TestBed.inject<C14>(C14);
                expect(stateC14.getState()).toEqual('VALUE');
            } catch (e) {
                message = e.message;
            }

            expect(message).toEqual(
                'Not found storage engine from `existingEngine` or not found instance after injecting by `useClass`. ' +
                    "\nMetadata { key: '@ngxs.store.c14' }"
            );
        });

        it('C15 stateClass', () => {
            localStorage.setItem(
                '@ngxs.store.c15',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'VALUE' })
            );

            @Persistence()
            @StateRepository()
            @State({ name: 'c15', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C15 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C15]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const actions$: Actions = TestBed.inject<Actions>(Actions);

            const events: string[] = [];

            actions$
                .pipe(ofActionDispatched({ type: NGXS_DATA_STORAGE_EVENT_TYPE }))
                .subscribe(() => events.push(`${NGXS_DATA_STORAGE_EVENT_TYPE}.DISPATCHED`));

            actions$
                .pipe(ofActionSuccessful({ type: NGXS_DATA_STORAGE_EVENT_TYPE }))
                .subscribe(() => events.push(`${NGXS_DATA_STORAGE_EVENT_TYPE}.SUCCESS`));

            const stateC15: C15 = TestBed.inject<C15>(C15);
            expect(stateC15.getState()).toEqual('VALUE');

            localStorage.setItem(
                '@ngxs.store.c15',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'VALUE_2' })
            );

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: '@ngxs.store.c15'
                })
            );

            expect(stateC15.getState()).toEqual('VALUE_2');

            localStorage.setItem('ANY_KEYS', 'ANY_VALUE');
            window.dispatchEvent(new StorageEvent('storage', { key: 'ANY_KEYS' }));

            localStorage.setItem(
                '@ngxs.store.c15',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'VALUE_3' })
            );

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: '@ngxs.store.c15'
                })
            );

            expect(stateC15.getState()).toEqual('VALUE_3');

            expect(events).toEqual([
                'NGXS_DATA_STORAGE_EVENT_TYPE.DISPATCHED',
                'NGXS_DATA_STORAGE_EVENT_TYPE.SUCCESS',
                'NGXS_DATA_STORAGE_EVENT_TYPE.DISPATCHED',
                'NGXS_DATA_STORAGE_EVENT_TYPE.SUCCESS'
            ]);
        });

        it('C16 stateClass', () => {
            localStorage.setItem(
                '@ngxs.store.c16',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'VALUE' })
            );

            @Persistence()
            @StateRepository()
            @State({ name: 'c16', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C16 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C16]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ],
                providers: [{ provide: PLATFORM_ID, useValue: 'server' }]
            });

            const actions$: Actions = TestBed.inject<Actions>(Actions);

            const events: string[] = [];

            actions$
                .pipe(ofActionDispatched({ type: NGXS_DATA_STORAGE_EVENT_TYPE }))
                .subscribe(() => events.push(`${NGXS_DATA_STORAGE_EVENT_TYPE}.DISPATCHED_NEXT`));

            actions$
                .pipe(ofActionSuccessful({ type: NGXS_DATA_STORAGE_EVENT_TYPE }))
                .subscribe(() => events.push(`${NGXS_DATA_STORAGE_EVENT_TYPE}.SUCCESS_NEXT`));

            const stateC16: C16 = TestBed.inject<C16>(C16);
            expect(stateC16.getState()).toEqual('DEFAULT_VALUE');

            localStorage.setItem(
                '@ngxs.store.c16',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'VALUE_2' })
            );

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: '@ngxs.store.c16'
                })
            );

            expect(stateC16.getState()).toEqual('DEFAULT_VALUE');

            localStorage.setItem('ANY_KEYS', 'ANY_VALUE');
            window.dispatchEvent(new StorageEvent('storage', { key: 'ANY_KEYS' }));

            localStorage.setItem(
                '@ngxs.store.c16',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'VALUE_3' })
            );

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: '@ngxs.store.c16'
                })
            );

            expect(stateC16.getState()).toEqual('DEFAULT_VALUE');

            expect(events).toEqual([]);
        });

        xit('C17 stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem(
                '@ngxs.store.c17',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'VALUE' })
            );

            @Injectable()
            class MyInvalidStorage implements DataStorage {
                public get length(): number {
                    return localStorage.length;
                }

                public key(_index: number): string | null {
                    return null!;
                }

                public getItem(key: string): string {
                    return JSON.stringify({
                        lastChanged: '2020-01-01T12:00:00.000Z',
                        data: 'MY_VAL::' + JSON.parse(localStorage.getItem(key) as string).data,
                        version: 1
                    });
                }

                public setItem(_key: string, val: string): void {
                    if (JSON.parse(val).data === 'HELLO_WORLD') {
                        throw new Error('Custom error');
                    }
                }

                public clear(): void {
                    // void
                }

                public removeItem(_key: string): void {
                    // void
                }
            }

            @Persistence({ useClass: MyInvalidStorage })
            @StateRepository()
            @State({ name: 'c17', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C17 extends NgxsImmutableDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([C17]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)],
                providers: [MyInvalidStorage]
            });

            const stateC14: C17 = TestBed.inject<C17>(C17);
            expect(stateC14.getState()).toEqual('MY_VAL::VALUE');

            stateC14.setState('HELLO_WORLD');

            expect(spy).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenLastCalledWith(
                "Error occurred while serializing value from metadata { key: '@ngxs.store.c17' }. \n" +
                    'Error serialize: Custom error'
            );
        });

        it('should be correct listen changes from storage and synchronized', () => {
            localStorage.setItem(
                '@ngxs.store.d1',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'VALUE_d1' })
            );

            sessionStorage.setItem(
                '@ngxs.store.d2',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 'VALUE_d2' })
            );

            @Persistence({
                existingEngine: localStorage
            })
            @StateRepository()
            @State({ name: 'd1', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class D1 extends NgxsDataRepository<string> {}

            @Persistence({
                existingEngine: sessionStorage
            })
            @StateRepository()
            @State({ name: 'd2', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class D2 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([D1, D2]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            const events: string[] = [];

            const d1: D1 = TestBed.inject<D1>(D1);
            const d2: D2 = TestBed.inject<D2>(D2);

            d1.state$.subscribe((s) => events.push(`d1: ${s}`));
            d2.state$.subscribe((s) => events.push(`d2: ${s}`));

            expect(d1.getState()).toEqual('VALUE_d1');
            expect(d2.getState()).toEqual('VALUE_d2');

            sessionStorage.setItem(
                '@ngxs.store.d2',
                JSON.stringify({ lastChanged: '2020-01-01T12:10:00.000Z', version: 1, data: 'VALUE_d2_2' })
            );

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: '@ngxs.store.d2'
                })
            );

            expect(d1.getState()).toEqual('VALUE_d1');
            expect(d2.getState()).toEqual('VALUE_d2_2');
            expect(events).toEqual(['d1: VALUE_d1', 'd2: VALUE_d2', 'd2: VALUE_d2_2']);

            sessionStorage.setItem(
                '@ngxs.store.d2',
                JSON.stringify({ lastChanged: '2020-01-01T12:20:00.000Z', version: 1, data: 'VALUE_d2_2' })
            );

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: '@ngxs.store.d2'
                })
            );

            expect(d1.getState()).toEqual('VALUE_d1');
            expect(d2.getState()).toEqual('VALUE_d2_2');
            expect(events).toEqual(['d1: VALUE_d1', 'd2: VALUE_d2', 'd2: VALUE_d2_2']);
        });

        it('should be correct listen changes from storage and synchronized when object', () => {
            interface EModel {
                a: number;
                b: number;
            }

            localStorage.setItem(
                '@ngxs.store.e1',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: { a: 1, b: 2 } })
            );

            sessionStorage.setItem(
                '@ngxs.store.e2',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: { a: 3, b: 4 } })
            );

            @Persistence({
                existingEngine: localStorage
            })
            @StateRepository()
            @State({ name: 'e1', defaults: { a: null, b: null } })
            @Injectable()
            class E1 extends NgxsDataRepository<EModel> {}

            @Persistence({
                existingEngine: sessionStorage
            })
            @StateRepository()
            @State({ name: 'e2', defaults: { a: null, b: null } })
            @Injectable()
            class E2 extends NgxsDataRepository<EModel> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([E1, E2]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            const events: string[] = [];

            const e1: E1 = TestBed.inject<E1>(E1);
            const e2: E2 = TestBed.inject<E2>(E2);

            e1.state$.subscribe((e) => events.push(`e1: ${JSON.stringify(e)}`));
            e2.state$.subscribe((e) => events.push(`e2: ${JSON.stringify(e)}`));

            expect(e1.getState()).toEqual({ a: 1, b: 2 });
            expect(e2.getState()).toEqual({ a: 3, b: 4 });

            expect(events).toEqual(['e1: {"a":1,"b":2}', 'e2: {"a":3,"b":4}']);

            sessionStorage.setItem(
                '@ngxs.store.e2',
                JSON.stringify({ lastChanged: '2020-01-01T12:10:00.000Z', version: 1, data: { a: 3, b: 4 } })
            );

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: '@ngxs.store.e2'
                })
            );

            expect(e1.getState()).toEqual({ a: 1, b: 2 });
            expect(e2.getState()).toEqual({ a: 3, b: 4 });
            expect(events).toEqual(['e1: {"a":1,"b":2}', 'e2: {"a":3,"b":4}']);

            sessionStorage.setItem(
                '@ngxs.store.e2',
                JSON.stringify({ lastChanged: '2020-01-01T12:20:00.000Z', version: 1, data: { a: 3, b: 4 } })
            );

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: '@ngxs.store.e2'
                })
            );

            expect(e1.getState()).toEqual({ a: 1, b: 2 });
            expect(e2.getState()).toEqual({ a: 3, b: 4 });
            expect(events).toEqual(['e1: {"a":1,"b":2}', 'e2: {"a":3,"b":4}']);
        });

        it('should be correct listen changes from storage and synchronized when slice object and defaults null', () => {
            interface EModel {
                a: number;
                b: number;
            }

            localStorage.setItem(
                '@ngxs.store.e1.a',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 1 })
            );

            localStorage.setItem(
                '@ngxs.store.e1.b',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 2 })
            );

            sessionStorage.setItem(
                '@ngxs.store.e2.a',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 3 })
            );

            sessionStorage.setItem(
                '@ngxs.store.e2.b',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1, data: 4 })
            );

            @Persistence([
                {
                    path: 'e1.a',
                    existingEngine: localStorage
                },
                {
                    path: 'e1.b',
                    existingEngine: localStorage
                }
            ])
            @StateRepository()
            @State({ name: 'e1', defaults: { a: null, b: null } })
            @Injectable()
            class E1 extends NgxsDataRepository<EModel> {}

            @Persistence([
                {
                    path: 'e2.a',
                    existingEngine: sessionStorage
                },
                {
                    path: 'e2.b',
                    existingEngine: sessionStorage
                }
            ])
            @StateRepository()
            @State({ name: 'e2', defaults: { a: null, b: null } })
            @Injectable()
            class E2 extends NgxsDataRepository<EModel> {}

            // noinspection DuplicatedCode
            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([E1, E2]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            const events: string[] = [];

            const e1: E1 = TestBed.inject<E1>(E1);
            const e2: E2 = TestBed.inject<E2>(E2);

            e1.state$.subscribe((e) => events.push(`e1: ${JSON.stringify(e)}`));
            e2.state$.subscribe((e) => events.push(`e2: ${JSON.stringify(e)}`));

            expect(e1.getState()).toEqual({ a: 1, b: 2 });
            expect(e2.getState()).toEqual({ a: 3, b: 4 });
            expect(events).toEqual(['e1: {"a":1,"b":2}', 'e2: {"a":3,"b":4}']);

            sessionStorage.setItem(
                '@ngxs.store.e2.a',
                JSON.stringify({ lastChanged: '2020-01-01T12:10:00.000Z', version: 1, data: 6 })
            );

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: '@ngxs.store.e2.a'
                })
            );

            expect(e1.getState()).toEqual({ a: 1, b: 2 });
            expect(e2.getState()).toEqual({ a: 6, b: 4 });
            expect(events).toEqual(['e1: {"a":1,"b":2}', 'e2: {"a":3,"b":4}', 'e2: {"a":6,"b":4}']);

            localStorage.setItem(
                '@ngxs.store.e1.a',
                JSON.stringify({ lastChanged: '2020-01-01T12:10:00.000Z', version: 1, data: 10 })
            );

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: '@ngxs.store.e1.a'
                })
            );

            expect(e1.getState()).toEqual({ a: 10, b: 2 });
            expect(e2.getState()).toEqual({ a: 6, b: 4 });
            expect(events).toEqual([
                'e1: {"a":1,"b":2}',
                'e2: {"a":3,"b":4}',
                'e2: {"a":6,"b":4}',
                'e1: {"a":10,"b":2}'
            ]);
        });

        describe('fire init', () => {
            it('fire init: true (default)', () => {
                const lastChanged: string = '2020-01-01T12:00:00.000Z';

                localStorage.setItem(
                    '@ngxs.store.fire',
                    JSON.stringify({ lastChanged: lastChanged, version: 1, data: 'FIRE_VALUE' })
                );

                @Persistence({
                    path: 'fire',
                    existingEngine: localStorage
                })
                @StateRepository()
                @State({ name: 'fire', defaults: null })
                @Injectable()
                class FireState extends NgxsDataRepository<string> {}

                // noinspection DuplicatedCode
                TestBed.configureTestingModule({
                    imports: [NgxsModule.forRoot([FireState]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
                });

                const fire: FireState = TestBed.inject<FireState>(FireState);
                expect(fire.snapshot).toEqual('FIRE_VALUE');

                const newLastChanged: string = JSON.parse(localStorage.getItem('@ngxs.store.fire')!).lastChanged;
                expect(lastChanged).not.toEqual(newLastChanged);
            });

            it('fire init: false', () => {
                const lastChanged: string = '2020-01-01T12:10:00.000Z';

                localStorage.setItem(
                    '@ngxs.store.fire2',
                    JSON.stringify({ lastChanged, version: 1, data: 'FIRE_VALUE' })
                );

                @Persistence({
                    path: 'fire2',
                    fireInit: false,
                    existingEngine: localStorage
                })
                @StateRepository()
                @State({ name: 'fire2', defaults: null })
                @Injectable()
                class Fire2State extends NgxsDataRepository<string> {}

                // noinspection DuplicatedCode
                TestBed.configureTestingModule({
                    imports: [NgxsModule.forRoot([Fire2State]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
                });

                const fire: Fire2State = TestBed.inject<Fire2State>(Fire2State);
                expect(fire.snapshot).toEqual('FIRE_VALUE');

                const newLastChanged: string = JSON.parse(localStorage.getItem('@ngxs.store.fire2')!).lastChanged;
                expect(lastChanged).toEqual(newLastChanged);

                fire.setState('FIRE2_VALUE');
                expect(fire.snapshot).toEqual('FIRE2_VALUE');

                const newLastChanged2: string = JSON.parse(localStorage.getItem('@ngxs.store.fire2')!).lastChanged;
                expect(lastChanged).not.toEqual(newLastChanged2);
            });
        });

        describe('nullable', () => {
            it('nullable: false (default)', () => {
                localStorage.setItem(
                    '@ngxs.store.storage',
                    JSON.stringify({ lastChanged: '2020-01-01T12:10:00.000Z', version: 1, data: null })
                );

                @Persistence({
                    existingEngine: localStorage
                })
                @StateRepository()
                @State({ name: 'storage', defaults: 'value' })
                @Injectable()
                class StorageState extends NgxsDataRepository<string> {}

                TestBed.configureTestingModule({
                    imports: [
                        NgxsModule.forRoot([StorageState]),
                        NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)
                    ]
                });

                const storage: StorageState = TestBed.inject<StorageState>(StorageState);
                expect(storage.getState()).toEqual('value');
            });

            it('nullable: true', () => {
                localStorage.setItem(
                    '@ngxs.store.storage',
                    JSON.stringify({ lastChanged: '2020-01-01T12:10:00.000Z', version: 1, data: null })
                );

                @Persistence({
                    nullable: true,
                    existingEngine: localStorage
                })
                @StateRepository()
                @State({ name: 'storage', defaults: 'value' })
                @Injectable()
                class StorageState extends NgxsDataRepository<string> {}

                TestBed.configureTestingModule({
                    imports: [
                        NgxsModule.forRoot([StorageState]),
                        NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)
                    ]
                });

                const storage: StorageState = TestBed.inject<StorageState>(StorageState);
                expect(storage.getState()).toEqual(null);
            });
        });

        describe('rehydrate', () => {
            it('rehydrate: true', () => {
                localStorage.setItem(
                    '@ngxs.store.rehydrate',
                    JSON.stringify({ lastChanged: '2020-01-01T12:10:00.000Z', version: 1, data: 'VALUE_FROM_STORAGE' })
                );

                @Persistence({
                    existingEngine: localStorage
                })
                @StateRepository()
                @State({ name: 'rehydrate', defaults: 'value' })
                @Injectable()
                class RehydrateState extends NgxsDataRepository<string> {}

                TestBed.configureTestingModule({
                    imports: [
                        NgxsModule.forRoot([RehydrateState]),
                        NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)
                    ]
                });

                const state: RehydrateState = TestBed.inject<RehydrateState>(RehydrateState);
                expect(state.getState()).toEqual('VALUE_FROM_STORAGE');
            });

            it('rehydrate: false', () => {
                localStorage.setItem(
                    '@ngxs.store.rehydrate',
                    JSON.stringify({ lastChanged: '2020-01-01T12:30:00.000Z', version: 1, data: 'VALUE_FROM_STORAGE' })
                );

                @Persistence({
                    rehydrate: false,
                    existingEngine: localStorage
                })
                @StateRepository()
                @State({ name: 'rehydrate', defaults: 'value' })
                @Injectable()
                class RehydrateState extends NgxsDataRepository<string> {}

                TestBed.configureTestingModule({
                    imports: [
                        NgxsModule.forRoot([RehydrateState]),
                        NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)
                    ]
                });

                const state: RehydrateState = TestBed.inject<RehydrateState>(RehydrateState);
                expect(state.getState()).toEqual('value');

                state.setState('new value');
                expect(state.getState()).toEqual('new value');
                expect(ensureMockStorage('@ngxs.store.rehydrate').data).toEqual('new value');
            });
        });

        describe('TTL', () => {
            interface AuthJwtModel {
                accessToken: string | null;
                refreshToken: string | null;
            }

            it('localstorage empty with ttl 10sec', fakeAsync(() => {
                @Persistence({
                    ttl: 10000, // 1000 * 10 = 10sec
                    ttlDelay: 500,
                    path: 'auth.accessToken',
                    existingEngine: localStorage
                })
                @StateRepository()
                @State<AuthJwtModel>({
                    name: 'auth',
                    defaults: {
                        accessToken: null,
                        refreshToken: null
                    }
                })
                @Injectable()
                class AuthJwtState extends NgxsDataRepository<AuthJwtModel> implements NgxsDataAfterExpired {
                    public internalEvents: { event: NgxsDataExpiredEvent; provider: PersistenceProvider }[] = [];
                    public expired$: Subject<NgxsDataExpiredEvent> = new Subject();

                    public ngxsDataAfterExpired(event: NgxsDataExpiredEvent, provider: PersistenceProvider): void {
                        this.internalEvents.push({ event, provider });
                    }
                }

                TestBed.configureTestingModule({
                    imports: [
                        NgxsModule.forRoot([AuthJwtState]),
                        NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)
                    ]
                });

                const state: AuthJwtState = TestBed.inject<AuthJwtState>(AuthJwtState);
                const events: NgxsDataExpiredEvent[] = [];

                state.expired$.subscribe((e) => events.push(e));
                expect(events.length).toEqual(0);
                expect(state.internalEvents.length).toEqual(0);

                const expiredFirst: string = ensureMockStorage('@ngxs.store.auth.accessToken').expiry!;

                tick(100);

                state.setState({ accessToken: 'ABC', refreshToken: 'CDE' });
                expect(state.getState()).toEqual({ accessToken: 'ABC', refreshToken: 'CDE' });

                const storageMeta: StorageMeta<string> = ensureMockStorage('@ngxs.store.auth.accessToken');
                expect(storageMeta.expiry).not.toEqual(expiredFirst);

                expect(storageMeta).toEqual({
                    lastChanged: expect.any(String),
                    expiry: expect.any(String),
                    version: 1,
                    data: 'ABC'
                });

                tick(5000);

                expect(ensureMockStorage('@ngxs.store.auth.accessToken')).toEqual({
                    lastChanged: expect.any(String),
                    expiry: expect.any(String),
                    version: 1,
                    data: 'ABC'
                });

                tick(10000);

                expect(ensureMockStorage('@ngxs.store.auth.accessToken')).toEqual({});
                expect(events).toEqual([
                    {
                        key: '@ngxs.store.auth.accessToken',
                        expiry: expect.any(String),
                        timestamp: expect.any(String)
                    }
                ]);

                expect(state.internalEvents).toEqual([
                    {
                        event: {
                            key: '@ngxs.store.auth.accessToken',
                            expiry: expect.any(String),
                            timestamp: expect.any(String)
                        },
                        provider: {
                            ttl: 10000,
                            ttlDelay: 500,
                            path: 'auth.accessToken',
                            existingEngine: expect.any(Storage),
                            version: 1,
                            decode: 'none',
                            prefixKey: '@ngxs.store.',
                            nullable: false,
                            fireInit: true,
                            skipMigrate: false,
                            rehydrate: true,
                            ttlExpiredStrategy: 0,
                            stateInstance: expect.any(AuthJwtState)
                        }
                    }
                ]);
            }));

            it('localstorage with prepared value with ttl 15sec', fakeAsync(() => {
                localStorage.setItem(
                    '@ngxs.store.auth.accessToken',
                    JSON.stringify({
                        lastChanged: '2020-01-01T12:10:00.000Z',
                        expiry: '2020-01-01T12:15:00.000Z',
                        version: 1,
                        data: 'ACCESS_TOKEN'
                    })
                );

                @Persistence({
                    ttl: 15000, // 1000 * 10 = 10sec
                    ttlDelay: 500,
                    path: 'auth.accessToken',
                    existingEngine: localStorage
                })
                @StateRepository()
                @State<AuthJwtModel>({
                    name: 'auth',
                    defaults: {
                        accessToken: null,
                        refreshToken: null
                    }
                })
                @Injectable()
                class AuthJwtState extends NgxsDataRepository<AuthJwtModel> implements NgxsDataAfterExpired {
                    public internalEvents: { event: NgxsDataExpiredEvent; provider: PersistenceProvider }[] = [];
                    public expired$: Subject<NgxsDataExpiredEvent> = new Subject();

                    public ngxsDataAfterExpired(event: NgxsDataExpiredEvent, provider: PersistenceProvider): void {
                        this.internalEvents.push({ event, provider });
                    }
                }

                TestBed.configureTestingModule({
                    imports: [
                        NgxsModule.forRoot([AuthJwtState]),
                        NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)
                    ]
                });

                const state: AuthJwtState = TestBed.inject<AuthJwtState>(AuthJwtState);
                const events: NgxsDataExpiredEvent[] = [];

                state.expired$.subscribe((e) => events.push(e));
                expect(events.length).toEqual(0);
                expect(state.internalEvents.length).toEqual(1);

                expect(state.internalEvents).toEqual([
                    {
                        event: {
                            key: '@ngxs.store.auth.accessToken',
                            expiry: expect.any(String),
                            timestamp: expect.any(String)
                        },
                        provider: {
                            ttl: 15000,
                            ttlDelay: 500,
                            path: 'auth.accessToken',
                            existingEngine: expect.any(Storage),
                            version: 1,
                            decode: 'none',
                            prefixKey: '@ngxs.store.',
                            nullable: false,
                            fireInit: true,
                            skipMigrate: false,
                            rehydrate: true,
                            ttlExpiredStrategy: 0,
                            stateInstance: expect.any(AuthJwtState)
                        }
                    }
                ]);

                expect(ensureMockStorage('@ngxs.store.auth.accessToken')).toEqual({
                    lastChanged: expect.any(String),
                    version: 1,
                    data: null,
                    expiry: expect.any(String)
                });

                tick(100);

                state.setState({ accessToken: 'ABC', refreshToken: 'CDE' });
                expect(state.getState()).toEqual({ accessToken: 'ABC', refreshToken: 'CDE' });

                expect(ensureMockStorage('@ngxs.store.auth.accessToken')).toEqual({
                    lastChanged: expect.any(String),
                    version: 1,
                    data: 'ABC',
                    expiry: expect.any(String)
                });

                tick(15000);

                expect(ensureMockStorage('@ngxs.store.auth.accessToken')).toEqual({});

                expect(events).toEqual([
                    {
                        key: '@ngxs.store.auth.accessToken',
                        expiry: expect.any(String),
                        timestamp: expect.any(String)
                    }
                ]);

                expect(state.internalEvents).toEqual([
                    {
                        event: {
                            key: '@ngxs.store.auth.accessToken',
                            expiry: expect.any(String),
                            timestamp: expect.any(String)
                        },
                        provider: {
                            ttl: 15000,
                            ttlDelay: 500,
                            path: 'auth.accessToken',
                            existingEngine: expect.any(Storage),
                            version: 1,
                            decode: 'none',
                            prefixKey: '@ngxs.store.',
                            nullable: false,
                            fireInit: true,
                            skipMigrate: false,
                            rehydrate: true,
                            ttlExpiredStrategy: 0,
                            stateInstance: expect.any(AuthJwtState)
                        }
                    },
                    {
                        event: {
                            key: '@ngxs.store.auth.accessToken',
                            expiry: expect.any(String),
                            timestamp: expect.any(String)
                        },
                        provider: {
                            ttl: 15000,
                            ttlDelay: 500,
                            path: 'auth.accessToken',
                            existingEngine: expect.any(Storage),
                            version: 1,
                            decode: 'none',
                            prefixKey: '@ngxs.store.',
                            nullable: false,
                            fireInit: true,
                            skipMigrate: false,
                            rehydrate: true,
                            ttlExpiredStrategy: 0,
                            stateInstance: expect.any(AuthJwtState)
                        }
                    }
                ]);
            }));
        });

        describe('Migration strategy', () => {
            it('v1 -> v2 (without migrate)', () => {
                localStorage.setItem(
                    '@ngxs.store.migrate',
                    JSON.stringify({
                        lastChanged: '2020-01-01T12:10:00.000Z',
                        version: 1,
                        data: 10
                    })
                );

                @Persistence({
                    version: 2,
                    existingEngine: localStorage
                })
                @StateRepository()
                @State({
                    name: 'migrate',
                    defaults: 'hello_world'
                })
                @Injectable()
                class MigrateV1toV2State extends NgxsDataRepository<string> {}

                TestBed.configureTestingModule({
                    imports: [
                        NgxsModule.forRoot([MigrateV1toV2State]),
                        NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)
                    ]
                });

                const state: MigrateV1toV2State = TestBed.inject<MigrateV1toV2State>(MigrateV1toV2State);

                expect(state.getState()).toEqual('hello_world');
                expect(ensureMockStorage('@ngxs.store.migrate')).toEqual({
                    lastChanged: expect.any(String),
                    version: 2,
                    data: 'hello_world'
                });
            });

            it('v1 -> v2 (with migrate)', () => {
                interface OldModel {
                    cachedIds: number[];
                    myValues: string[];
                }

                interface NewModel {
                    ids: number[];
                    values: string[];
                }

                localStorage.setItem(
                    '@ngxs.store.migrate',
                    JSON.stringify({
                        lastChanged: '2020-01-01T12:10:00.000Z',
                        version: 1,
                        data: {
                            cachedIds: [1, 2, 3],
                            myValues: ['123', '5125', '255']
                        }
                    })
                );

                @Persistence({
                    version: 2,
                    existingEngine: localStorage
                })
                @StateRepository()
                @State<NewModel>({
                    name: 'migrate',
                    defaults: {
                        ids: [5, 7],
                        values: ['63']
                    }
                })
                @Injectable()
                class MigrateV1toV2State extends NgxsDataRepository<NewModel> implements NgxsDataMigrateStorage {
                    public ngxsDataStorageMigrate(defaults: NewModel, storage: OldModel): NewModel {
                        return {
                            ids: [...defaults.ids, ...storage.cachedIds],
                            values: [...defaults.values, ...storage.myValues]
                        };
                    }
                }

                TestBed.configureTestingModule({
                    imports: [
                        NgxsModule.forRoot([MigrateV1toV2State]),
                        NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)
                    ]
                });

                const state: MigrateV1toV2State = TestBed.inject<MigrateV1toV2State>(MigrateV1toV2State);

                expect(state.getState()).toEqual({ ids: [5, 7, 1, 2, 3], values: ['63', '123', '5125', '255'] });

                expect(ensureMockStorage('@ngxs.store.migrate')).toEqual({
                    lastChanged: expect.any(String),
                    version: 2,
                    data: { ids: [5, 7, 1, 2, 3], values: ['63', '123', '5125', '255'] }
                });
            });

            it('migrate v1 -> v2 when multiple providers', () => {
                sessionStorage.setItem(
                    '@ngxs.store.deepFilter.myFilter',
                    JSON.stringify({
                        lastChanged: '2020-01-01T12:10:00.000Z',
                        version: 1,
                        data: { phoneValue: '8911-111-1111' }
                    })
                );

                localStorage.setItem(
                    '@ngxs.store.deepFilter.options',
                    JSON.stringify({
                        lastChanged: '2020-01-01T12:10:00.000Z',
                        version: 1,
                        data: { size: 10, number: 2 }
                    })
                );

                interface MyFilter {
                    phone: string | null;
                    cardNumber: string | null;
                }

                interface MyOptions {
                    pageSize: number | null;
                    pageNumber: number | null;
                }

                interface NewModel {
                    myFilter: MyFilter;
                    options: MyOptions;
                }

                @Persistence([
                    {
                        version: 2,
                        path: 'deepFilter.myFilter',
                        existingEngine: sessionStorage,
                        migrate: (defaults: MyFilter, storage: { phoneValue: string }): MyFilter => ({
                            ...defaults,
                            phone: storage.phoneValue
                        })
                    },
                    {
                        version: 2,
                        path: 'deepFilter.options',
                        existingEngine: localStorage,
                        migrate: (defaults: MyOptions, storage: { size: number; number: number }): MyOptions => ({
                            ...defaults,
                            pageSize: storage.size,
                            pageNumber: storage.number
                        })
                    }
                ])
                @StateRepository()
                @State<NewModel>({
                    name: 'deepFilter',
                    defaults: {
                        myFilter: {
                            phone: null,
                            cardNumber: null
                        },
                        options: {
                            pageNumber: null,
                            pageSize: null
                        }
                    }
                })
                @Injectable()
                class DeepFilterState extends NgxsDataRepository<NewModel> implements NgxsDataMigrateStorage {
                    public invoker: number = 0;

                    public ngxsDataStorageMigrate(defaults: Any, _storage: Any): Any {
                        this.invoker++;
                        return defaults;
                    }
                }

                TestBed.configureTestingModule({
                    imports: [
                        NgxsModule.forRoot([DeepFilterState]),
                        NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)
                    ]
                });

                const state: DeepFilterState = TestBed.inject<DeepFilterState>(DeepFilterState);

                expect(state.getState()).toEqual({
                    myFilter: { phone: '8911-111-1111', cardNumber: null },
                    options: { pageNumber: 2, pageSize: 10 }
                });

                expect(ensureMockStorage('@ngxs.store.deepFilter.myFilter', sessionStorage)).toEqual({
                    lastChanged: expect.any(String),
                    version: 2,
                    data: { phone: '8911-111-1111', cardNumber: null }
                });

                expect(ensureMockStorage('@ngxs.store.deepFilter.options')).toEqual({
                    lastChanged: expect.any(String),
                    version: 2,
                    data: { pageNumber: 2, pageSize: 10 }
                });

                expect(state.invoker).toEqual(0);
            });

            it('skip migrate v1 -> v2', () => {
                sessionStorage.setItem(
                    '@ngxs.store.deepFilter.myFilter',
                    JSON.stringify({
                        lastChanged: '2020-01-01T12:10:00.000Z',
                        version: 1,
                        data: { phoneValue: '8911-111-1111' }
                    })
                );

                localStorage.setItem(
                    '@ngxs.store.deepFilter.options',
                    JSON.stringify({
                        lastChanged: '2020-01-01T12:10:00.000Z',
                        version: 1,
                        data: { size: 10, number: 2 }
                    })
                );

                interface MyFilter {
                    phone: string | null;
                    cardNumber: string | null;
                }

                interface MyOptions {
                    pageSize: number | null;
                    pageNumber: number | null;
                }

                interface NewModel {
                    myFilter: MyFilter;
                    options: MyOptions;
                }

                @Persistence([
                    {
                        version: 2,
                        skipMigrate: true,
                        path: 'deepFilter.myFilter',
                        existingEngine: sessionStorage
                    },
                    {
                        version: 2,
                        skipMigrate: true,
                        path: 'deepFilter.options',
                        existingEngine: localStorage
                    }
                ])
                @StateRepository()
                @State<NewModel>({
                    name: 'deepFilter',
                    defaults: {
                        myFilter: {
                            phone: null,
                            cardNumber: null
                        },
                        options: {
                            pageNumber: null,
                            pageSize: null
                        }
                    }
                })
                @Injectable()
                class DeepFilterState extends NgxsDataRepository<NewModel> implements NgxsDataMigrateStorage {
                    public invoker: number = 0;

                    public ngxsDataStorageMigrate(defaults: Any, _storage: Any): Any {
                        this.invoker++;
                        return defaults;
                    }
                }

                TestBed.configureTestingModule({
                    imports: [
                        NgxsModule.forRoot([DeepFilterState]),
                        NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)
                    ]
                });

                const state: DeepFilterState = TestBed.inject<DeepFilterState>(DeepFilterState);

                expect(state.getState()).toEqual({
                    myFilter: { phone: null, cardNumber: null },
                    options: { pageNumber: null, pageSize: null }
                });

                expect(ensureMockStorage('@ngxs.store.deepFilter.myFilter', sessionStorage)).toEqual({
                    lastChanged: expect.any(String),
                    version: 2,
                    data: { phone: null, cardNumber: null }
                });

                expect(ensureMockStorage('@ngxs.store.deepFilter.options')).toEqual({
                    lastChanged: expect.any(String),
                    version: 2,
                    data: { pageNumber: null, pageSize: null }
                });

                expect(state.invoker).toEqual(0);
            });
        });

        it('should be correct invoked after storage event', () => {
            localStorage.setItem(
                '@ngxs.store.count',
                JSON.stringify({
                    lastChanged: '2020-01-01T12:10:00.000Z',
                    version: 1,
                    data: 5
                })
            );

            @Persistence()
            @StateRepository()
            @State({
                name: 'count',
                defaults: 0
            })
            @Injectable()
            class CountState extends NgxsDataRepository<number> implements NgxsDataAfterStorageEvent {
                public events: NgxsDataStorageEvent[] = [];
                public ngxsDataAfterStorageEvent(event: NgxsDataStorageEvent) {
                    this.events.push(event);
                }
            }

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([CountState]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            const state: CountState = TestBed.inject<CountState>(CountState);

            expect(state.getState()).toEqual(5);

            localStorage.setItem(
                '@ngxs.store.count',
                JSON.stringify({ lastChanged: '2020-01-01T12:10:00.000Z', version: 1, data: 15 })
            );

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: '@ngxs.store.count'
                })
            );

            expect(state.getState()).toEqual(15);

            expect(state.events).toEqual([
                {
                    key: '@ngxs.store.count',
                    value: expect.any(String),
                    data: 15,
                    provider: {
                        path: 'count',
                        existingEngine: expect.any(Storage),
                        ttl: -1,
                        version: 1,
                        decode: 'none',
                        prefixKey: '@ngxs.store.',
                        nullable: false,
                        fireInit: true,
                        rehydrate: true,
                        ttlDelay: 60000,
                        ttlExpiredStrategy: 0,
                        stateInstance: expect.any(CountState),
                        skipMigrate: false
                    }
                }
            ]);
        });

        it('should be correct encode/decode', () => {
            localStorage.setItem(
                '@ngxs.store.filter',
                JSON.stringify({
                    lastChanged: '2020-05-04T19:53:06.310Z',
                    version: 1,
                    data: 'eyJwaG9uZSI6IjExMTExIiwiY2FyZCI6IjIyMjIyIn0='
                })
            );

            interface FilterModel {
                phone: string;
                card: string;
            }

            @Persistence()
            @StateRepository()
            @State({
                name: 'filter',
                defaults: {
                    phone: null,
                    card: null
                }
            })
            @Injectable()
            class FilterState extends NgxsDataRepository<FilterModel> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([FilterState]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)],
                providers: [{ provide: NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN, useValue: STORAGE_DECODE_TYPE.BASE64 }]
            });

            const state: FilterState = TestBed.inject<FilterState>(FilterState);

            // noinspection DuplicatedCode
            const container: StorageContainer = TestBed.inject(NGXS_DATA_STORAGE_CONTAINER_TOKEN);
            expect(container.getProvidedKeys()).toEqual(['@ngxs.store.filter']);

            expect(Array.from(container.providers)).toEqual([
                {
                    path: 'filter',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'base64',
                    prefixKey: '@ngxs.store.',
                    nullable: false,
                    rehydrate: true,
                    fireInit: true,
                    skipMigrate: false,
                    stateInstance: expect.any(FilterState),
                    ttlExpiredStrategy: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED,
                    ttlDelay: STORAGE_TTL_DELAY
                }
            ]);

            expect(state.getState()).toEqual({ phone: '11111', card: '22222' });

            expect(ensureMockStorage('@ngxs.store.filter')).toEqual({
                lastChanged: expect.any(String),
                version: 1,
                data: 'eyJwaG9uZSI6IjExMTExIiwiY2FyZCI6IjIyMjIyIn0='
            });

            state.setState({ phone: '4444', card: '5555' });

            expect(ensureMockStorage('@ngxs.store.filter')).toEqual({
                version: 1,
                lastChanged: expect.any(String),
                data: 'eyJwaG9uZSI6IjQ0NDQiLCJjYXJkIjoiNTU1NSJ9'
            });
        });

        function ensureMockStorage<T>(key: string, storage: Storage = localStorage): StorageMeta<T> {
            return JSON.parse(storage.getItem(key)! ?? '{}');
        }

        afterEach(() => {
            localStorage.clear();
            sessionStorage.clear();
            spy?.mockClear();
        });
    });
});
