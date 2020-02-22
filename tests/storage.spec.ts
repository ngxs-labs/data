import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { action, NgxsDataPluginModule, NgxsDataRepository, Persistence, StateRepository } from '@ngxs-labs/data';
import { NgxsModule, State, Store } from '@ngxs/store';

import { NgxsDataStorageEngine } from '../src/services/ngxs-data-storage-engine';

describe('[TEST]: CountState persistence', () => {
    let store: Store;

    describe('Native (LocalStorage, SessionStorage)', () => {
        it('A stateClass', () => {
            @Persistence()
            @StateRepository()
            @State({ name: 'a', defaults: 0 })
            @Injectable()
            class A extends NgxsDataRepository<number> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([A]), NgxsDataPluginModule.forRoot()]
            });

            store = TestBed.get<Store>(Store);
            const a: A = TestBed.get<A>(A);

            expect(a.getState()).toEqual(0);
            expect(store.snapshot()).toEqual({ a: 0 });
            expect(JSON.parse(localStorage.getItem('@ngxs.store.a')!)).toEqual({
                lastChanged: expect.any(String),
                version: 1,
                data: 0
            });

            expect(NgxsDataStorageEngine.getProvidedKeys()).toEqual(['@ngxs.store.a']);
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
                imports: [NgxsModule.forRoot([B]), NgxsDataPluginModule.forRoot()]
            });

            store = TestBed.get<Store>(Store);
            const b: B = TestBed.get<B>(B);

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

            expect(NgxsDataStorageEngine.getProvidedKeys()).toEqual(['@ngxs.store.b']);
        });

        afterEach(() => {
            localStorage.clear();
            sessionStorage.clear();
            NgxsDataStorageEngine.clear();
        });
    });
});
