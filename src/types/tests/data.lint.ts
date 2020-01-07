/// <reference types="@types/jest" />
import { action, Immutable, NgxsDataMutablePipe, NgxsDataRepository, StateRepository } from '@ngxs-labs/data';
import { NgxsModule, State } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';
import { Injectable, Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';

import { ParentCountModel } from '../../../integration/app/examples/count/count.model';
import { CountSubState } from '../../../integration/app/examples/count/count-sub.state';

describe('TEST', () => {
    it('should be correct test for CountState', () => {
        @StateRepository()
        @State<ParentCountModel>({
            name: 'count',
            defaults: { val: 0 },
            children: [CountSubState]
        })
        @Injectable()
        class CountState extends NgxsDataRepository<ParentCountModel> {
            public number$ = this.state$.pipe(
                map(
                    // $ExpectType (state: DeepImmutableObject<ParentCountModel>) => number
                    (state) => {
                        // noinspection UnnecessaryLocalVariableJS
                        const currentState = state; // $ExpectType DeepImmutableObject<ParentCountModel>
                        return currentState.countSub!.val;
                    }
                )
            );

            public deepCount$ = this.state$.pipe(
                map(
                    // $ExpectType (state: DeepImmutableObject<ParentCountModel>) => DeepImmutableObject<CountModel>
                    (state) => {
                        // noinspection UnnecessaryLocalVariableJS
                        const currentState = state; // $ExpectType DeepImmutableObject<ParentCountModel>
                        return currentState.countSub!;
                    }
                )
            );

            @action()
            public increment(): void {
                this.ctx.setState((state: Immutable<ParentCountModel>) => ({ ...state, val: state.val + 1 }));
            }

            @action()
            public incrementDeep(): void {
                this.ctx.setState(
                    // $ExpectType (state: DeepImmutableObject<ParentCountModel>) => { countSub: { val: number; }; val: number; }
                    (state) => {
                        // noinspection UnnecessaryLocalVariableJS
                        const prevState = state; // $ExpectType DeepImmutableObject<ParentCountModel>

                        return {
                            ...prevState,
                            countSub: { val: state.countSub!.val + 1 }
                        };
                    }
                );
            }

            @action()
            public incrementInvalidDeep(): void {
                this.ctx.setState(
                    // $ExpectType (state: DeepImmutableObject<ParentCountModel>) => { a: number; val: number; countSub?: DeepImmutableObject<CountModel> | undefined; }
                    (state) => ({ ...state, a: 1 })
                );
            }

            @action()
            public decrement(): void {
                this.setState((state: Immutable<ParentCountModel>) => ({ ...state, val: state.val - 1 }));
            }

            @action({ async: true, debounce: 300 })
            public setValueFromInput(val: string | number): void {
                this.ctx.setState((state) => ({ ...state, val: parseFloat(val as string) || 0 }));
            }
        }

        NgxsModule.forRoot([CountState]);

        const counter: CountState = TestBed.get<CountState>(CountState);

        // noinspection BadExpressionStatementJS
        counter.state$; // $ExpectType Observable<DeepImmutableObject<ParentCountModel>>
        // noinspection BadExpressionStatementJS
        counter.number$; // $ExpectType Observable<number>
        // noinspection BadExpressionStatementJS
        counter.deepCount$; // $ExpectType Observable<DeepImmutableObject<CountModel>>

        it('immutable type', () => {
            interface B {
                b: number;
                c: number;
                d: { g: number };
            }

            const b1: Immutable<B> = { b: 1, c: 2, d: { g: 3 } };

            b1.b++; // $ExpectError
            b1.c++; // $ExpectError
            b1.d.g++; // $ExpectError

            const b2 = b1 as B;
            b2.c++; // $ExpectType number
            b2.d.g++; // $ExpectType number
        });

        it('immutable - preserve mutate', () => {
            interface A {
                val: number;
                b: number;
                c: number;
            }

            const a: A = { val: 0, b: 2, c: 3 };
            const nonImmutable: ParentCountModel = { val: 0, countSub: { val: 0 } };
            const immutable: Immutable<ParentCountModel> = { val: 0, countSub: { val: 0 } };

            counter.setState(a); // $ExpectType void
            counter.setState({ val: 0 }); // $ExpectType void
            counter.setState(nonImmutable); // $ExpectType void
            counter.setState(immutable); // $ExpectType void

            // noinspection BadExpressionStatementJS
            counter.initialState; // $ExpectType DeepImmutableObject<ParentCountModel>

            counter.patchState({ val: 10 }); // $ExpectType void
            counter.patchState({ val: 10, countSub: { val: 5 } }); // $ExpectType void
            counter.patchState(nonImmutable); // $ExpectType void
            counter.patchState(a); // $ExpectType void

            counter.setState(
                // $ExpectType (state: DeepImmutableObject<ParentCountModel>) => DeepImmutableObject<ParentCountModel>
                (state) => {
                    state.val++; // $ExpectError
                    state.countSub!.val++; // $ExpectError
                    return state;
                }
            );

            counter.setState({ val: 0, b: 2, c: 3 }); // $ExpectError
            counter.patchState({ a: 5 }); // $ExpectError
            counter.patchState({ val: 10, countSub: { val: 5, b: 10 } }); // $ExpectError
            counter.initialState.val++; // $ExpectError
            counter.getState().val++; // $ExpectError
        });
    });

    it('preserve immutable', () => {
        @StateRepository()
        @State<string[]>({
            name: 'todo',
            defaults: []
        })
        @Injectable()
        class TodosState extends NgxsDataRepository<string[]> {
            reversed$ = this.state$.pipe(
                map(
                    (state) => state.reverse() // $ExpectError
                )
            );
        }

        @Component({ selector: 'todo' })
        class TodoComponent {
            @Input() public data: string[];
        }

        @Component({
            selector: 'app',
            template: '<todo [data]="todos.state$ | async | mutable"></todo>'
        })
        class AppComponent {
            constructor(public todos: TodosState) {}
        }

        TestBed.configureTestingModule({
            declarations: [AppComponent, TodoComponent],
            imports: [NgxsModule.forRoot([TodosState])]
        });

        const todos: TodosState = TestBed.get<TodosState>(TodosState);

        const stream = new AsyncPipe(null!).transform(todos.state$);
        stream; // $ExpectType DeepImmutableArray<string> | null

        const state = new NgxsDataMutablePipe().transform(stream);
        state; // $ExpectType string[]
    });

    it('immutable to mutable', () => {
        @StateRepository()
        @State<ParentCountModel>({
            name: 'count',
            defaults: { val: 0 }
        })
        @Injectable()
        class MyState extends NgxsDataRepository<ParentCountModel> {
            // $ExpectType Observable<ParentCountModel>
            public mutableState$ = this.state$.pipe(
                map((state: Immutable<ParentCountModel>) => state as ParentCountModel)
            );
        }

        NgxsModule.forRoot([MyState]);
        const myState: MyState = TestBed.get<MyState>(MyState);

        myState.state$; // $ExpectType Observable<DeepImmutableObject<ParentCountModel>>

        myState.state$.subscribe((state) => {
            const mutable = { ...state }; // $ExpectType { val: number; countSub?: DeepImmutableObject<CountModel> | undefined; }
            mutable.val++; // $ExpectType number

            // mutatate
            state.val++; // $ExpectError
            mutable.countSub.val++; // $ExpectError
        });

        // Immutable to Mutable
        const state: ParentCountModel = new NgxsDataMutablePipe().transform(
            new AsyncPipe(null!).transform(myState.state$)
        );

        state; // $ExpectType ParentCountModel
        state.val++; // $ExpectType number
        state.countSub!.val++; // $ExpectType number

        myState.mutableState$; // $ExpectType Observable<ParentCountModel>

        myState.mutableState$.subscribe((state) => {
            const mutable = { ...state }; // $ExpectType { val: number; countSub?: CountModel | undefined; }
            mutable.val++; // $ExpectType number

            state.val++; // $ExpectType number
            mutable.countSub!.val++; // $ExpectType number
        });
    });

    it('deep mutable', () => {
        type B = { val: number };

        interface C {
            b: B;
        }

        const d: Array<Immutable<C>> = [{ b: { val: 1 } }, { b: { val: 2 } }];

        d[0].b.val++; // $ExpectError

        const mutable = new NgxsDataMutablePipe().transform(d);
        mutable; // C[]
        mutable[0].b.val++; // $ExpectType number

        mutable[0].b; // $ExpectType B
    });
});
