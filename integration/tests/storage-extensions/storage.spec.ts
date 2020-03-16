/* eslint-disable */
import { Injectable, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { action, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import {
    NGXS_DATA_STORAGE_CONTAINER,
    NGXS_DATA_STORAGE_CONTAINER_TOKEN,
    NGXS_DATA_STORAGE_EXTENSION,
    NGXS_DATA_STORAGE_PLUGIN,
    NGXS_DATA_STORAGE_PREFIX_TOKEN,
    NgxsDataStoragePlugin
} from '@ngxs-labs/data/storage';
import { Any, DataStorage, StorageContainer } from '@ngxs-labs/data/typings';
import { Actions, NGXS_PLUGINS, NgxsModule, ofActionDispatched, ofActionSuccessful, State, Store } from '@ngxs/store';
import { NGXS_DATA_EXCEPTIONS, NGXS_DATA_STORAGE_EVENT_TYPE } from '@ngxs-labs/data/tokens';

describe('[TEST]: Storage plugin', () => {
    let store: Store;
    let spy: jest.MockInstance<Any, Any>;

    function ensureStoragePlugin(): NgxsDataStoragePlugin {
        const services: Any[] = TestBed.get(NGXS_PLUGINS);

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

            store = TestBed.get<Store>(Store);
            const plugin: NgxsDataStoragePlugin = ensureStoragePlugin();

            // noinspection SuspiciousTypeOfGuard
            expect(plugin instanceof NgxsDataStoragePlugin).toEqual(true);
            expect(plugin['_platformId']).toEqual('browser');
            expect(plugin.store === store).toEqual(true);
        });

        it('@Persistence should be add before decorator @State and @StateRepository', () => {
            let message: string | null = null;

            try {
                @Persistence()
                @State({ name: 'custom', defaults: 'hello world' })
                @Injectable()
                class Invalid extends NgxsDataRepository<string> {}

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
            class CustomState extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([CustomState]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION])
                ]
            });

            let message: string | null = null;

            try {
                const state: CustomState = TestBed.get(CustomState);
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
            class CustomState extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([CustomState]), NgxsDataPluginModule.forRoot()]
            });

            let message: string | null = null;

            try {
                const state: CustomState = TestBed.get(CustomState);
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
            class A extends NgxsDataRepository<number> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([A]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            store = TestBed.get<Store>(Store);
            const a: A = TestBed.get<A>(A);

            const container: StorageContainer = TestBed.get(NGXS_DATA_STORAGE_CONTAINER_TOKEN);
            expect(container.getProvidedKeys()).toEqual(['@ngxs.store.a']);

            expect(Array.from(container.providers)).toEqual([
                {
                    path: 'a',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    nullable: false
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
                    nullable: false
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
            class B extends NgxsDataRepository<number> {
                @action()
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

            store = TestBed.get<Store>(Store);
            const b: B = TestBed.get<B>(B);

            const container: StorageContainer = TestBed.get(NGXS_DATA_STORAGE_CONTAINER_TOKEN);
            expect(container.getProvidedKeys()).toEqual(['@ngxs.store.b']);

            expect(Array.from(container.providers)).toEqual([
                {
                    path: 'b',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    nullable: false
                }
            ]);

            expect(b.getState()).toEqual(50);
            expect(store.snapshot()).toEqual({ b: 50 });
            expect(JSON.parse(localStorage.getItem('@ngxs.store.b')!)).toEqual({
                lastChanged: expect.any(String),
                version: 1,
                data: 50
            });

            b.increment()
                .increment()
                .increment();

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
                    nullable: false
                }
            ]);
        });

        it('C stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem('@ngxs.store.c', 'invalid');

            @Persistence()
            @StateRepository()
            @State({ name: 'c', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const stateC: C = TestBed.get<C>(C);

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

        it('C1 stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem('@ngxs.store.c1', JSON.stringify(1));

            @Persistence()
            @StateRepository()
            @State({ name: 'c1', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C1 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C1]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const stateC1: C1 = TestBed.get<C1>(C1);

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

        it('C2 stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem('@ngxs.store.c2', JSON.stringify({ hello: 'world' }));

            @Persistence()
            @StateRepository()
            @State({ name: 'c2', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C2 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C2]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const stateC2: C2 = TestBed.get<C2>(C2);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenLastCalledWith(
                'Error occurred while deserializing value from metadata { key: \'@ngxs.store.c2\', value: \'{"hello":"world"}\' }. \n' +
                    'Error deserialize: lastChanged key not found in object {"hello":"world"}.'
            );

            expect(stateC2.getState()).toEqual('DEFAULT_VALUE');
        });

        it('C3 stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem('@ngxs.store.c3', JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z' }));

            @Persistence()
            @StateRepository()
            @State({ name: 'c3', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C3 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C3]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const stateC3: C3 = TestBed.get<C3>(C3);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenLastCalledWith(
                'Error occurred while deserializing value from metadata { key: \'@ngxs.store.c3\', value: \'{"lastChanged":"2020-01-01T12:00:00.000Z"}\' }. \n' +
                    "Error deserialize: It's not possible to determine version (undefined), since it must be a integer type and must equal or more than 1."
            );

            expect(stateC3.getState()).toEqual('DEFAULT_VALUE');
        });

        it('C4 stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem(
                '@ngxs.store.c4',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: '1.5' })
            );

            @Persistence()
            @StateRepository()
            @State({ name: 'c4', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C4 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C4]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const stateC4: C4 = TestBed.get<C4>(C4);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenLastCalledWith(
                'Error occurred while deserializing value from metadata { key: \'@ngxs.store.c4\', value: \'{"lastChanged":"2020-01-01T12:00:00.000Z","version":"1.5"}\' }. \n' +
                    "Error deserialize: It's not possible to determine version (1.5), since it must be a integer type and must equal or more than 1."
            );

            expect(stateC4.getState()).toEqual('DEFAULT_VALUE');
        });

        it('C5 stateClass', () => {
            spy = jest.spyOn(console, 'warn').mockImplementation();

            localStorage.setItem(
                '@ngxs.store.c5',
                JSON.stringify({ lastChanged: '2020-01-01T12:00:00.000Z', version: 1 })
            );

            @Persistence()
            @StateRepository()
            @State({ name: 'c5', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C5 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C5]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const stateC5: C5 = TestBed.get<C5>(C5);

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
            class C6 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([C6]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)],
                providers: [{ provide: NGXS_DATA_STORAGE_PREFIX_TOKEN, useValue: '@myCompany.store.' }]
            });

            const stateC6: C6 = TestBed.get<C6>(C6);

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
            class C7 extends NgxsDataRepository<string> {}

            @Persistence({ existingEngine: localStorage })
            @StateRepository()
            @State({ name: 'c8', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C8 extends NgxsDataRepository<string> {}

            @Persistence({ existingEngine: localStorage, prefixKey: 'customer.' })
            @StateRepository()
            @State({ name: 'c9', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C9 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([C7, C8, C9]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            const stateC7: C7 = TestBed.get<C7>(C7);
            const stateC8: C8 = TestBed.get<C8>(C8);
            const stateC9: C8 = TestBed.get<C9>(C9);

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
                    nullable: false
                },
                {
                    path: 'c8',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    nullable: false
                },
                {
                    path: 'c7',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    nullable: true
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
            class C10 extends NgxsDataRepository<string> {}

            @Persistence({ existingEngine: localStorage })
            @StateRepository()
            @State({ name: 'c11', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C11 extends NgxsDataRepository<string> {}

            @Persistence({ existingEngine: localStorage })
            @StateRepository()
            @State({ name: 'c12', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C12 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([C10, C11, C12]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            const stateC10: C10 = TestBed.get<C10>(C10);
            const stateC11: C11 = TestBed.get<C11>(C11);
            const stateC12: C12 = TestBed.get<C12>(C12);

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
                    nullable: false
                },
                {
                    path: 'c11',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    nullable: false
                },
                {
                    path: 'c10',
                    existingEngine: expect.any(Storage),
                    ttl: -1,
                    version: 1,
                    decode: 'none',
                    prefixKey: '@ngxs.store.',
                    nullable: false
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
            class C13 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([C13]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            let message: string | null = null;

            try {
                const stateC13: C13 = TestBed.get<C13>(C13);
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
                public readonly length: number;

                public key(index: number): string | null {
                    return null!;
                }

                public getItem(key: string): string {
                    return '';
                }

                public setItem(key: string, val: Any): void {
                    // void
                }

                public clear(): void {
                    // void
                }

                public removeItem(key: string): void {
                    // void
                }
            }

            @Persistence({ useClass: MyStorage })
            @StateRepository()
            @State({ name: 'c14', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C14 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([C14]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            let message: string | null = null;

            try {
                const stateC14: C14 = TestBed.get<C14>(C14);
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
            class C15 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C15]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ]
            });

            const actions$: Actions = TestBed.get<Actions>(Actions);

            const events: string[] = [];

            actions$
                .pipe(ofActionDispatched({ type: NGXS_DATA_STORAGE_EVENT_TYPE }))
                .subscribe(() => events.push(`${NGXS_DATA_STORAGE_EVENT_TYPE}.DISPATCHED`));

            actions$
                .pipe(ofActionSuccessful({ type: NGXS_DATA_STORAGE_EVENT_TYPE }))
                .subscribe(() => events.push(`${NGXS_DATA_STORAGE_EVENT_TYPE}.SUCCESS`));

            const stateC15: C15 = TestBed.get<C15>(C15);
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
            class C16 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [
                    NgxsModule.forRoot([C16]),
                    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
                ],
                providers: [{ provide: PLATFORM_ID, useValue: 'server' }]
            });

            const actions$: Actions = TestBed.get<Actions>(Actions);

            const events: string[] = [];

            actions$
                .pipe(ofActionDispatched({ type: NGXS_DATA_STORAGE_EVENT_TYPE }))
                .subscribe(() => events.push(`${NGXS_DATA_STORAGE_EVENT_TYPE}.DISPATCHED_NEXT`));

            actions$
                .pipe(ofActionSuccessful({ type: NGXS_DATA_STORAGE_EVENT_TYPE }))
                .subscribe(() => events.push(`${NGXS_DATA_STORAGE_EVENT_TYPE}.SUCCESS_NEXT`));

            const stateC16: C16 = TestBed.get<C16>(C16);
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

        it('C17 stateClass', () => {
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

                public key(index: number): string | null {
                    return null!;
                }

                public getItem(key: string): string {
                    return JSON.stringify({
                        lastChanged: '2020-01-01T12:00:00.000Z',
                        data: 'MY_VAL::' + JSON.parse(localStorage.getItem(key) as string).data,
                        version: 1
                    });
                }

                public setItem(key: string, val: string): void {
                    if (JSON.parse(val).data === 'HELLO_WORLD') {
                        throw new Error('Custom error');
                    }
                }

                public clear(): void {
                    // void
                }

                public removeItem(key: string): void {
                    // void
                }
            }

            @Persistence({ useClass: MyInvalidStorage })
            @StateRepository()
            @State({ name: 'c17', defaults: 'DEFAULT_VALUE' })
            @Injectable()
            class C17 extends NgxsDataRepository<string> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([C17]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)],
                providers: [MyInvalidStorage]
            });

            const stateC14: C17 = TestBed.get<C17>(C17);
            expect(stateC14.getState()).toEqual('MY_VAL::VALUE');

            stateC14.setState('HELLO_WORLD');

            expect(spy).toHaveBeenCalledTimes(1);
            expect(console.warn).toHaveBeenLastCalledWith(
                "Error occurred while serializing value from metadata { key: '@ngxs.store.c17' }. \n" +
                    'Error serialize: Custom error'
            );
        });

        afterEach(() => {
            localStorage.clear();
            sessionStorage.clear();
            spy?.mockClear();
        });
    });
});
