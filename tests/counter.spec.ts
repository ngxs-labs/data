import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { action, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataFactory } from '@ngxs-labs/data/internals';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { NgxsRepositoryMeta } from '@ngxs-labs/data/typings';
import { Actions, NgxsModule, ofActionDispatched, State, Store } from '@ngxs/store';

describe('[TEST]: CountState', () => {
    let store: Store;

    it('should be get correct snapshot from simple state', () => {
        @State({ name: 'count', defaults: 0 })
        class CountState {}

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([CountState])]
        });

        store = TestBed.get<Store>(Store);

        expect(store.snapshot()).toEqual({ count: 0 });
    });

    describe('Exceptions', () => {
        it('@StateRepository should be add before decorator @State', () => {
            try {
                @Injectable()
                @State({
                    name: 'count',
                    defaults: 0
                })
                @StateRepository()
                class CountState extends NgxsDataRepository<number> {}

                TestBed.configureTestingModule({
                    imports: [NgxsModule.forRoot([CountState])]
                });
            } catch (e) {
                expect(e.message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE);
            }
        });

        it('should be throw exception when not import NgxsDataModulePlugin', () => {
            @Injectable()
            @StateRepository()
            @State({
                name: 'count',
                defaults: 0
            })
            class CountState extends NgxsDataRepository<number> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([CountState])]
            });

            store = TestBed.get<Store>(Store);
            const count: CountState = TestBed.get<CountState>(CountState);

            expect(store.snapshot()).toEqual({ count: 0 });

            try {
                count.getState();
            } catch (e) {
                expect(e.message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
            }
        });

        it('should be throw when forgot add @StateRepository', () => {
            @Injectable()
            @State({
                name: 'count',
                defaults: 0
            })
            class CountState extends NgxsDataRepository<number> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([CountState]), NgxsDataPluginModule.forRoot()]
            });

            const count: CountState = TestBed.get<CountState>(CountState);

            try {
                count.getState();
            } catch (e) {
                expect(e.message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
            }
        });

        it('should be throw when forgot add @StateRepository', () => {
            @Injectable()
            @State({
                name: 'count',
                defaults: 0
            })
            class CountState extends NgxsDataRepository<number> {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([]), NgxsDataPluginModule.forRoot()],
                providers: [CountState]
            });

            const count: CountState = TestBed.get<CountState>(CountState);

            try {
                count.getState();
            } catch (e) {
                expect(e.message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
            }
        });

        it('should be throw when invalid instance', () => {
            try {
                NgxsDataFactory.getRepositoryByInstance(null);
            } catch (e) {
                expect(e.message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
            }
        });

        it('should be throw when use @action without context', () => {
            @State({
                name: 'count',
                defaults: 0
            })
            class CountState {
                @action()
                public incorrect(): void {}
            }

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([CountState])]
            });

            const count: CountState = TestBed.get<CountState>(CountState);

            try {
                count.incorrect();
            } catch (e) {
                expect(e.message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
            }
        });

        it('should be throw when use static with @action', () => {
            try {
                @State({
                    name: 'count',
                    defaults: 0
                })
                @StateRepository()
                class CountState {
                    @action()
                    public static incorrect(): void {}
                }

                CountState.incorrect();
            } catch (e) {
                expect(e.message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATIC_ACTION);
            }
        });
    });

    describe('Correct behavior NGXS DATA', () => {
        let count: CountState;
        let actions$: Actions;

        @Injectable()
        @StateRepository()
        @State({
            name: 'count',
            defaults: 0
        })
        class CountState extends NgxsDataRepository<number> {
            public withoutAction(val: number): void {
                this.ctx.setState(val);
            }

            @action()
            public withAction(val: number): void {
                this.ctx.setState(val);
            }
        }

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([CountState]), NgxsDataPluginModule.forRoot()]
            });

            count = TestBed.get<CountState>(CountState);
            store = TestBed.get<Store>(Store);
            actions$ = TestBed.get<Actions>(Actions);
        });

        it('should be correct get name', () => {
            expect(count.name).toEqual('count');
        });

        it('should be correct works with setState/getState', () => {
            const val: number[] = [];

            count.state$.subscribe((value: number) => val.push(value));

            expect(count.getState()).toEqual(0);
            expect(store.snapshot()).toEqual({ count: 0 });

            count.setState(10);
            count.reset();

            count.setState((state: number) => ++state);
            count.setState((state: number) => --state);
            count.setState((state: number) => ++state);

            expect(count.getState()).toEqual(1);
            expect(store.snapshot()).toEqual({ count: 1 });

            count.reset();
            expect(count.getState()).toEqual(0);
            expect(store.snapshot()).toEqual({ count: 0 });

            expect(val).toEqual([0, 10, 0, 1, 0, 1, 0]);
        });

        it('should be correct works with withoutAction/withAction', () => {
            const dispatched: number[] = [];
            actions$
                .pipe(ofActionDispatched({ type: '@count.withAction(val)' }))
                .subscribe((val) => dispatched.push(val));

            expect(count.getState()).toEqual(0);
            expect(store.snapshot()).toEqual({ count: 0 });

            count.withoutAction(5);

            expect(count.getState()).toEqual(5);
            expect(store.snapshot()).toEqual({ count: 5 });

            count.withAction(15);
            expect(count.getState()).toEqual(15);
            expect(store.snapshot()).toEqual({ count: 15 });

            count.withAction(10);
            expect(count.getState()).toEqual(10);
            expect(store.snapshot()).toEqual({ count: 10 });

            expect(dispatched).toEqual([
                { type: '@count.withAction(val)', payload: { val: 15 } },
                { type: '@count.withAction(val)', payload: { val: 10 } }
            ]);
        });

        it('should be correct instance repository', () => {
            const repository: NgxsRepositoryMeta = NgxsDataFactory.getRepositoryByInstance(count);

            expect(repository.stateMeta!.name).toEqual('count');
            expect(repository.stateMeta!.actions).toEqual({
                '@count.setState(stateValue)': [
                    {
                        type: '@count.setState(stateValue)',
                        options: { cancelUncompleted: true },
                        fn: '@count.setState(stateValue)'
                    }
                ],
                '@count.reset()': [
                    {
                        type: '@count.reset()',
                        options: { cancelUncompleted: true },
                        fn: '@count.reset()'
                    }
                ],
                '@count.withAction(val)': [
                    {
                        type: '@count.withAction(val)',
                        options: { cancelUncompleted: true },
                        fn: '@count.withAction(val)'
                    }
                ]
            });

            expect(repository.operations).toEqual({
                setState: {
                    argumentsNames: ['stateValue'],
                    type: '@count.setState(stateValue)',
                    options: { cancelUncompleted: true }
                },
                reset: {
                    argumentsNames: [],
                    type: '@count.reset()',
                    options: { cancelUncompleted: true }
                },
                withAction: {
                    argumentsNames: ['val'],
                    type: '@count.withAction(val)',
                    options: { cancelUncompleted: true }
                }
            });
        });
    });
});
