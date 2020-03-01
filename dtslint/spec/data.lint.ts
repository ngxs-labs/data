/// <reference types="@types/jest" />
import { action, StateRepository } from '@ngxs-labs/data';
import { NgxsModule, State } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';
import { Component, Injectable, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';

import { NgxsDataMutablePipe } from '../../lib/utils/src/pipes/mutable/ngxs-data-mutable.pipe';
import { ParentCountModel } from '../../integration/app/examples/count/count.model';
import { CountSubState } from '../../integration/app/examples/count/count-sub.state';
import { Immutable, Mutable } from '@ngxs-labs/data/typings';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';

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
                    // $ExpectType (state: Immutable<ParentCountModel>) => number
                    (state) => {
                        // noinspection UnnecessaryLocalVariableJS
                        const currentState = state; // $ExpectType Immutable<ParentCountModel>
                        return currentState.countSub!.val;
                    }
                )
            );

            public deepCount$ = this.state$.pipe(
                map(
                    // $ExpectType (state: Immutable<ParentCountModel>) => Immutable<CountModel>
                    (state) => {
                        // noinspection UnnecessaryLocalVariableJS
                        const currentState = state; // $ExpectType Immutable<ParentCountModel>
                        return currentState.countSub!;
                    }
                )
            );

            @action()
            public increment(): void {
                this.ctx.setState(
                    // $ExpectType (state: Immutable<ParentCountModel>) => { val: number; countSub?: Immutable<CountModel> | undefined; }
                    (state: Immutable<ParentCountModel>) => ({ ...state, val: state.val + 1 })
                );
            }

            @action()
            public incrementDeep(): void {
                this.ctx.setState(
                    // $ExpectType (state: Immutable<ParentCountModel>) => { countSub: { val: number; }; val: number; }
                    (state) => {
                        // noinspection UnnecessaryLocalVariableJS
                        const prevState = state; // $ExpectType Immutable<ParentCountModel>

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
                    // $ExpectType (state: Immutable<ParentCountModel>) => { a: number; val: number; countSub?: Immutable<CountModel> | undefined; }
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
        counter.state$; // $ExpectType Observable<Immutable<ParentCountModel>>
        // noinspection BadExpressionStatementJS
        counter.number$; // $ExpectType Observable<number>
        // noinspection BadExpressionStatementJS
        counter.deepCount$; // $ExpectType Observable<Immutable<CountModel>>

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
            counter.initialState; // $ExpectType Immutable<ParentCountModel>

            counter.patchState({ val: 10 }); // $ExpectType void
            counter.patchState({ val: 10, countSub: { val: 5 } }); // $ExpectType void
            counter.patchState(nonImmutable); // $ExpectType void
            counter.patchState(a); // $ExpectType void

            counter.setState(
                // $ExpectType (state: Immutable<ParentCountModel>) => Immutable<ParentCountModel>
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
        stream; // $ExpectType readonly string[] | null

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

        myState.state$; // $ExpectType Observable<Immutable<ParentCountModel>>

        myState.state$.subscribe((state) => {
            const mutable = { ...state }; // $ExpectType { val: number; countSub?: Immutable<CountModel> | undefined; }
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

    it('use NgxsDataMutablePipe', () => {
        type B = { val: number };

        interface C {
            b: B;
        }

        const d: Immutable<C[]> = [{ b: { val: 1 } }, { b: { val: 2 } }];

        d[0].b.val++; // $ExpectError

        const mutable = new NgxsDataMutablePipe().transform(d);
        mutable; // C[]
        mutable.reverse(); // C[]
        mutable[0].b.val++; // $ExpectType number

        mutable[0].b; // $ExpectType Mutable<B>

        const e: Mutable<B> = { val: 5 };
        const f: B = e; // $ExpectType Mutable<B>
    });

    it('deep mutable', () => {
        type Deep = { val: number; hello: { world: boolean } };

        let a: Deep = { val: 1, hello: { world: true } };
        let b: Immutable<Deep> = { val: 1, hello: { world: true } };

        a.val = 5;
        a.hello.world = false;

        b.val = 5; // $ExpectError
        b.hello.world = false; // $ExpectError

        function mutateDeep(value: Deep): Deep {
            value.hello.world = false;
            return value;
        }

        function mutateImmutableDeep(value: Immutable<Deep>): Immutable<Deep> {
            (value.hello as any).world = false;
            return value;
        }

        let c: Deep = mutateDeep(b); // $ExpectType Deep
        c.hello.world = false;

        let d: Immutable<Deep> = mutateImmutableDeep(a); // $ExpectType Immutable<Deep>

        let arr: Array<Immutable<Deep>> = [a, b, c];
        arr.reverse(); // $ExpectType Immutable<Deep>[]
    });
});
