import { buildDefaultsGraph, ensureStateMetadata, getStateMetadata } from '@ngxs-labs/data/internals';
import { NgxsModule, State, Store } from '@ngxs/store';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { Injectable } from '@angular/core';
import { MetaDataModel, SharedSelectorOptions } from '@ngxs/store/src/internal/internals';
import { isObservable } from 'rxjs';
import { Any } from '@ngxs-labs/data/typings';

describe('[TEST]: Utils', () => {
    it('build-defaults-graph', () => {
        class ClassicClass {}

        expect(buildDefaultsGraph(ClassicClass)).toEqual({});

        @State({ name: 'helloState' })
        @Injectable()
        class HelloState {}

        expect(buildDefaultsGraph(HelloState)).toEqual({});

        @State({
            name: 'worldState',
            defaults: {
                hello: { world: true }
            }
        })
        @Injectable()
        class WorldState {}

        expect(buildDefaultsGraph(WorldState)).toEqual({ hello: { world: true } });

        @State({
            name: 'coolState',
            defaults: { cool: 'yep' },
            children: [WorldState]
        })
        @Injectable()
        class CoolState {}

        expect(buildDefaultsGraph(CoolState)).toEqual({ cool: 'yep', worldState: { hello: { world: true } } });

        let message: string | null = null;

        try {
            class B {}

            class C {}

            @State({
                name: 'a',
                defaults: {},
                children: [B, C]
            })
            @Injectable()
            class A {}

            buildDefaultsGraph(A);
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual('State name not provided in class');

        @State({
            name: 'f',
            defaults: []
        })
        @Injectable()
        class F {}

        @State({
            name: 'e',
            defaults: []
        })
        class E {}

        @State({
            name: 'd',
            defaults: {},
            children: [E, F]
        })
        @Injectable()
        class D {}

        expect(buildDefaultsGraph(D)).toEqual({ e: [], f: [] });

        message = null;

        try {
            @State({
                name: 'G',
                defaults: [],
                children: [E, F]
            })
            class G {}

            buildDefaultsGraph(G);
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual('Child states can only be added to an object. Cannot convert Array to PlainObject');
    });

    it('should be create singleton context', () => {
        @StateRepository()
        @State({
            name: 'myState',
            defaults: 'any'
        })
        @Injectable()
        class MyState extends NgxsImmutableDataRepository<string> {}

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([MyState]), NgxsDataPluginModule.forRoot()]
        });

        const state: MyState = TestBed.get(MyState);
        const store: Store = TestBed.get(Store);
        expect(state.getState() === new MyState().getState());

        new MyState().setState('hello');

        expect(state.getState()).toEqual('hello');
        expect(store.snapshot()).toEqual({ myState: 'hello' });
    });

    it('should be correct ensure state metadata', () => {
        class MyState {}

        const meta: MetaDataModel = ensureStateMetadata(MyState);

        expect(meta).toEqual({
            name: null,
            actions: {},
            defaults: {},
            path: null,
            makeRootSelector: expect.any(Function),
            children: []
        });

        expect(
            meta.makeRootSelector!({
                getSelectorOptions(localOptions?: SharedSelectorOptions): SharedSelectorOptions {
                    return localOptions as Any;
                },
                getStateGetter(_key: any): (state: any) => any {
                    // selector
                    return (state) => state;
                }
            })({ hello: 'world' })
        ).toEqual({ hello: 'world' });
    });

    it('should be correct get state metadata', () => {
        @StateRepository()
        @State({
            name: 'app',
            defaults: [1, 2, 3]
        })
        @Injectable()
        class AppState extends NgxsImmutableDataRepository<number> {}

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([AppState]), NgxsDataPluginModule.forRoot()]
        });

        const state: AppState = TestBed.get(AppState);
        const store: Store = TestBed.get(Store);
        const meta: MetaDataModel = getStateMetadata(AppState);

        expect(isObservable(state.state$)).toEqual(true);
        expect(meta).toEqual({
            name: 'app',
            actions: {},
            defaults: [1, 2, 3],
            path: 'app',
            makeRootSelector: expect.any(Function),
            children: undefined
        });

        expect(
            meta.makeRootSelector!({
                getSelectorOptions(localOptions?: SharedSelectorOptions): SharedSelectorOptions {
                    return localOptions as Any;
                },
                getStateGetter(key: any): (state: any) => any {
                    // selector
                    return (state) => state[key];
                }
            })(store.snapshot())
        ).toEqual([1, 2, 3]);
    });
});
