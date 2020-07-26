import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { NgxsModule, State, Store } from '@ngxs/store';

describe('[TEST]: Reset', () => {
    let store: Store;

    @StateRepository()
    @State({
        name: 'D'
    })
    @Injectable()
    class D {}

    @StateRepository()
    @State({
        name: 'C',
        children: [D]
    })
    @Injectable()
    class C {}

    @StateRepository()
    @State({
        name: 'B',
        children: []
    })
    @Injectable()
    class B {}

    @StateRepository()
    @State({
        name: 'A',
        children: [B, C]
    })
    @Injectable()
    class A extends NgxsImmutableDataRepository<object> {}

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([A, B, C, D]), NgxsDataPluginModule.forRoot()]
        }).compileComponents();

        store = TestBed.inject<Store>(Store);
    });

    it('should be correct reset A state', () => {
        const a: A = TestBed.inject<A>(A);
        expect(store.snapshot()).toEqual({ A: { C: { D: {} }, B: {} } });
        expect(a.getState()).toEqual({ C: { D: {} }, B: {} });

        a.reset();

        expect(store.snapshot()).toEqual({ A: { C: { D: {} }, B: {} } });
    });

    it('should be throw when incorrect children', () => {
        let message: string | null = null;

        try {
            @State({ name: 'foo' })
            class FooState {}

            @StateRepository()
            @State({ name: 'bar', defaults: 'string', children: [FooState] })
            class BarState {}

            new BarState();
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual('Child states can only be added to an object. Cannot convert String to PlainObject');

        try {
            @State({ name: 'foo' })
            class FooState {}

            @StateRepository()
            @State({ name: 'bar', defaults: [], children: [FooState] })
            class BarState {}

            new BarState();
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual('Child states can only be added to an object. Cannot convert Array to PlainObject');

        try {
            @State({ name: 'foo' })
            class FooState {}

            @StateRepository()
            @State({ name: 'bar', defaults: null, children: [FooState] })
            class BarState {}

            new BarState();
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual('Child states can only be added to an object. Cannot convert null to PlainObject');
    });
});
