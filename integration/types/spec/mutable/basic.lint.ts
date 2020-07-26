/// <reference types="@types/jest" />
import { NgxsModule, State } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ParentCountModel } from '../../../app/src/examples/count/count.model';
import { CountSubState } from '../../../app/src/examples/count/count-sub.state';
import { Immutable } from '@angular-ru/common/typings';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { DataAction, Debounce, StateRepository } from '@ngxs-labs/data/decorators';

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
                    // $ExpectType (state: ParentCountModel) => number
                    (state) => {
                        // noinspection UnnecessaryLocalVariableJS
                        const currentState = state; // $ExpectType ParentCountModel
                        return currentState.countSub!.val;
                    }
                )
            );

            public deepCount$ = this.state$.pipe(
                map(
                    // $ExpectType (state: ParentCountModel) => CountModel
                    (state) => {
                        // noinspection UnnecessaryLocalVariableJS
                        const currentState = state; // $ExpectType ParentCountModel
                        return currentState.countSub!;
                    }
                )
            );

            @DataAction()
            public increment(): void {
                this.ctx.setState(
                    // $ExpectType (state: Immutable<ParentCountModel>) => { val: number; countSub?: Immutable<CountModel> | undefined; }
                    (state: Immutable<ParentCountModel>) => ({ ...state, val: state.val + 1 })
                );
            }

            @DataAction()
            public incrementDeep(): void {
                this.ctx.setState(
                    // $ExpectType (state: ParentCountModel) => { countSub: { val: number; }; val: number; }
                    (state) => {
                        // noinspection UnnecessaryLocalVariableJS
                        const prevState = state; // $ExpectType ParentCountModel

                        return {
                            ...prevState,
                            countSub: { val: state.countSub!.val + 1 }
                        };
                    }
                );
            }

            @DataAction()
            public incrementInvalidDeep(): void {
                this.ctx.setState(
                    // $ExpectType (state: ParentCountModel) => { a: number; val: number; countSub?: CountModel | undefined; }
                    (state) => ({ ...state, a: 1 })
                );
            }

            @DataAction()
            public decrement(): void {
                this.setState((state: Immutable<ParentCountModel>) => ({ ...state, val: state.val - 1 }));
            }

            @Debounce()
            @DataAction()
            public setValueFromInput(val: string | number): void {
                this.ctx.setState((state) => ({ ...state, val: parseFloat(val as string) || 0 }));
            }
        }

        NgxsModule.forRoot([CountState]);

        const counter: CountState = TestBed.inject<CountState>(CountState);

        // noinspection BadExpressionStatementJS
        counter.state$; // $ExpectType Observable<ParentCountModel>
        // noinspection BadExpressionStatementJS
        counter.number$; // $ExpectType Observable<number>
        // noinspection BadExpressionStatementJS
        counter.deepCount$; // $ExpectType Observable<CountModel>

        counter.setState(
            // $ExpectType (state: ParentCountModel) => ParentCountModel
            (state) => {
                state.val++;
                state.countSub!.val++;
                return state;
            }
        );
    });

    it('as mutable', () => {
        @StateRepository()
        @State<ParentCountModel>({
            name: 'count',
            defaults: { val: 0 }
        })
        @Injectable()
        class MyState extends NgxsDataRepository<ParentCountModel> {
            // $ExpectType Observable<ParentCountModel>
            public mutableState$ = this.state$.pipe(
                map(
                    // $ExpectType (state: ParentCountModel) => ParentCountModel
                    (state) => state
                )
            );
        }

        NgxsModule.forRoot([MyState]);
        const myState: MyState = TestBed.inject<MyState>(MyState);

        myState.state$; // $ExpectType Observable<ParentCountModel>

        myState.state$.subscribe((state) => {
            state.val++;
            state.countSub!.val++;
        });

        myState.mutableState$; // $ExpectType Observable<ParentCountModel>

        myState.mutableState$.subscribe((state) => {
            const mutable = { ...state }; // $ExpectType { val: number; countSub?: CountModel | undefined; }
            mutable.val++; // $ExpectType number

            state.val++; // $ExpectType number
            mutable.countSub!.val++; // $ExpectType number
        });
    });
});
