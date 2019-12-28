/// <reference types="@types/jest" />
import { action, Immutable, NgxsDataRepository, StateRepository } from '@ngxs-labs/data';
import { NgxsModule, State } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
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
                    // $ExpectType (state: DeepImmutableObject<ParentCountModel>) => { deepCount: { val: number; }; val: number; }
                    (state) => {
                        // noinspection UnnecessaryLocalVariableJS
                        const prevState = state; // $ExpectType DeepImmutableObject<ParentCountModel>

                        return {
                            ...prevState,
                            deepCount: { val: state.countSub!.val + 1 }
                        };
                    }
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
