/* eslint-disable */
import { Injectable } from '@angular/core';
import { NgxsModule, State, Store } from '@ngxs/store';
import { DataAction, computed, StateRepository } from '@ngxs-labs/data/decorators';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsDataRepository, NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { getSequenceIdFromTarget } from '@ngxs-labs/data/internals';

describe('[TEST]: Computed fields', () => {
    it('should be throw when invalid annotated', () => {
        let message: string | null = null;

        try {
            @StateRepository()
            @State({ name: 'a', defaults: 'value' })
            @Injectable()
            class A extends NgxsDataRepository<string> {
                @computed()
                public getSnapshot(): string {
                    return this.ctx.getState();
                }
            }

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([A]), NgxsDataPluginModule.forRoot()]
            });
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual(
            NGXS_DATA_EXCEPTIONS.NGXS_COMPUTED_DECORATOR + `\nExample: \n@computed get getSnapshot() { \n\t .. \n}`
        );
    });

    it('should be correct memoized state', () => {
        @StateRepository()
        @State({ name: 'b', defaults: 'value' })
        @Injectable()
        class B extends NgxsDataRepository<string> {
            public countSnapshot: number = 0;

            @computed()
            public get snapshot(): string {
                this.countSnapshot++;
                return this.ctx.getState();
            }
        }

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([B]), NgxsDataPluginModule.forRoot()]
        });

        const b: B = TestBed.get<B>(B); // sequenceId = 0

        expect(b.snapshot).toEqual('value');
        expect(b.snapshot).toEqual('value');
        expect(b.snapshot).toEqual('value');
        expect(b.snapshot).toEqual('value');
        expect(b.snapshot).toEqual('value');

        b.setState('hello'); // sequenceId = 1

        expect(b.snapshot).toEqual('hello');
        expect(b.snapshot).toEqual('hello');
        expect(b.countSnapshot).toEqual(2);

        b.setState('world'); // sequenceId = 2

        expect(b.snapshot).toEqual('world');
        expect(b.snapshot).toEqual('world');
        expect(b.snapshot).toEqual('world');
        expect(b.snapshot).toEqual('world');
        expect(b.countSnapshot).toEqual(3);

        expect(getSequenceIdFromTarget(b)).toEqual(2);
    });

    describe('calculate total', () => {
        interface OrderLineModel {
            price: number;
            amount: number;
        }

        it('should be correct computed values with NgxsDataRepository', () => {
            @StateRepository()
            @State<OrderLineModel>({
                name: 'orderLine',
                defaults: {
                    price: 0,
                    amount: 1
                }
            })
            @Injectable()
            class OrderLineState extends NgxsDataRepository<OrderLineModel> {
                public memoized: number = 0;
                public nonMemoized: number = 0;

                @computed()
                public get total(): number {
                    this.memoized++;
                    return this.snapshot.price * this.snapshot.amount;
                }

                public get classicTotal(): number {
                    this.nonMemoized++;
                    return this.snapshot.price * this.snapshot.amount;
                }

                @DataAction()
                public setPrice(price: number): void {
                    this.ctx.setState((state) => ({ price, amount: state.amount }));
                }

                @DataAction()
                public setAmount(amount: number): void {
                    this.ctx.setState((state) => ({ price: state.price, amount }));
                }
            }

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([OrderLineState]), NgxsDataPluginModule.forRoot()]
            });

            const state: OrderLineState = TestBed.get<OrderLineState>(OrderLineState);

            // noinspection DuplicatedCode
            expect(state.total).toEqual(0);
            expect(state.total).toEqual(0);
            expect(state.total).toEqual(0);
            expect(state.total).toEqual(0);
            expect(state.memoized).toEqual(1);

            // noinspection DuplicatedCode
            expect(state.classicTotal).toEqual(0);
            expect(state.classicTotal).toEqual(0);
            expect(state.classicTotal).toEqual(0);
            expect(state.classicTotal).toEqual(0);
            expect(state.nonMemoized).toEqual(4);

            state.setAmount(5);
            state.setPrice(5);

            // noinspection DuplicatedCode
            expect(state.total).toEqual(25);
            expect(state.total).toEqual(25);
            expect(state.total).toEqual(25);
            expect(state.total).toEqual(25);
            expect(state.memoized).toEqual(2);

            // noinspection DuplicatedCode
            expect(state.classicTotal).toEqual(25);
            expect(state.classicTotal).toEqual(25);
            expect(state.classicTotal).toEqual(25);
            expect(state.classicTotal).toEqual(25);
            expect(state.nonMemoized).toEqual(8);
        });

        it('should be correct computed values with NgxsImmutableDataRepository', () => {
            @StateRepository()
            @State<OrderLineModel>({
                name: 'orderLine',
                defaults: {
                    price: 0,
                    amount: 1
                }
            })
            @Injectable()
            class ImmutableOrderLineState extends NgxsImmutableDataRepository<OrderLineModel> {
                public memoized: number = 0;
                public nonMemoized: number = 0;

                @computed()
                public get total(): number {
                    this.memoized++;
                    return this.snapshot.price * this.snapshot.amount;
                }

                public get classicTotal(): number {
                    this.nonMemoized++;
                    return this.snapshot.price * this.snapshot.amount;
                }

                @DataAction()
                public setPrice(price: number): void {
                    this.ctx.setState((state) => ({ price, amount: state.amount }));
                }

                @DataAction()
                public setAmount(amount: number): void {
                    this.ctx.setState((state) => ({ price: state.price, amount }));
                }
            }

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([ImmutableOrderLineState]), NgxsDataPluginModule.forRoot()]
            });

            const state: ImmutableOrderLineState = TestBed.get<ImmutableOrderLineState>(ImmutableOrderLineState);

            // noinspection DuplicatedCode
            expect(state.total).toEqual(0);
            expect(state.total).toEqual(0);
            expect(state.total).toEqual(0);
            expect(state.total).toEqual(0);
            expect(state.memoized).toEqual(1);

            // noinspection DuplicatedCode
            expect(state.classicTotal).toEqual(0);
            expect(state.classicTotal).toEqual(0);
            expect(state.classicTotal).toEqual(0);
            expect(state.classicTotal).toEqual(0);
            expect(state.nonMemoized).toEqual(4);

            state.setAmount(5);
            state.setPrice(5);

            // noinspection DuplicatedCode
            expect(state.total).toEqual(25);
            expect(state.total).toEqual(25);
            expect(state.total).toEqual(25);
            expect(state.total).toEqual(25);
            expect(state.memoized).toEqual(2);

            // noinspection DuplicatedCode
            expect(state.classicTotal).toEqual(25);
            expect(state.classicTotal).toEqual(25);
            expect(state.classicTotal).toEqual(25);
            expect(state.classicTotal).toEqual(25);
            expect(state.nonMemoized).toEqual(8);
        });
    });

    it('should be correct computed when change other states', () => {
        abstract class CommonCounter extends NgxsDataRepository<number> {
            @DataAction()
            public increment() {
                this.ctx.setState((state: number) => ++state);
            }
        }

        @StateRepository()
        @State({
            name: 'a',
            defaults: 0
        })
        @Injectable()
        class A extends CommonCounter {}

        @StateRepository()
        @State({
            name: 'b',
            defaults: 0
        })
        @Injectable()
        class B extends CommonCounter {}

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([A, B]), NgxsDataPluginModule.forRoot()]
        });

        const store: Store = TestBed.get<Store>(Store);
        const a: A = TestBed.get<A>(A);
        const b: B = TestBed.get<B>(B);

        expect(store.snapshot()).toEqual({ b: 0, a: 0 });
        expect(a.snapshot).toEqual(0);
        expect(b.snapshot).toEqual(0);

        a.increment();
        a.increment();
        a.increment();
        b.increment();

        expect(store.snapshot()).toEqual({ b: 1, a: 3 });
        expect(a.snapshot).toEqual(3);
        expect(b.snapshot).toEqual(1);
    });

    it('should be correct computed when change other states and inherited state', () => {
        @State({
            name: 'commonCounter',
            defaults: 0
        })
        @Injectable()
        class CommonCounterState extends NgxsDataRepository<number> {
            @DataAction()
            public increment() {
                this.ctx.setState((state: number) => ++state);
            }
        }

        @StateRepository()
        @State({ name: 'a' })
        @Injectable()
        class A extends CommonCounterState {}

        @StateRepository()
        @State({ name: 'b' })
        @Injectable()
        class B extends CommonCounterState {}

        // noinspection DuplicatedCode
        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([A, B]), NgxsDataPluginModule.forRoot()]
        });

        const store: Store = TestBed.get<Store>(Store);
        const a: A = TestBed.get<A>(A);
        const b: B = TestBed.get<B>(B);

        expect(store.snapshot()).toEqual({ b: 0, a: 0 });
        expect(a.snapshot).toEqual(0);
        expect(b.snapshot).toEqual(0);

        a.increment();
        a.increment();
        a.increment();
        b.increment();

        expect(store.snapshot()).toEqual({ b: 1, a: 3 });
        expect(a.snapshot).toEqual(3);
        expect(b.snapshot).toEqual(1);

        a.reset();
        b.reset();

        b.increment();
        b.increment();
        b.increment();
        a.increment();

        expect(store.snapshot()).toEqual({ b: 3, a: 1 });
        expect(a.snapshot).toEqual(1);
        expect(b.snapshot).toEqual(3);
        expect(a.snapshot === a.getState()).toBeTruthy();
        expect(b.snapshot === b.getState()).toBeTruthy();

        a.increment();
        a.increment();
        a.increment();
        a.increment();
        a.increment();
        a.increment();
        b.increment();

        expect(store.snapshot()).toEqual({ b: 4, a: 7 });
        expect(a.snapshot).toEqual(7);
        expect(b.snapshot).toEqual(4);
        expect(a.snapshot === a.getState()).toBeTruthy();
        expect(b.snapshot === b.getState()).toBeTruthy();
    });
});
