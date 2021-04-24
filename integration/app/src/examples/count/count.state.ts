import { Injectable } from '@angular/core';
import { Immutable } from '@angular-ru/common/typings';
import { State, StateToken } from '@ngxs/store';
import { Computed, DataAction, Debounce, Payload, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CountModel, ParentCountModel } from './count.model';
import { CountSubState } from './count-sub.state';

const COUNT_TOKEN: StateToken<ParentCountModel> = new StateToken<ParentCountModel>('count');

@StateRepository()
@State<ParentCountModel>({
    name: COUNT_TOKEN,
    defaults: { val: 0 },
    children: [CountSubState]
})
@Injectable()
export class CountState extends NgxsImmutableDataRepository<ParentCountModel> {
    @Computed()
    public get values$(): Observable<ParentCountModel | undefined> {
        return this.state$.pipe(map((state: Immutable<ParentCountModel>): CountModel | undefined => state.countSub));
    }

    @DataAction()
    public increment(): void {
        this.ctx.setState(
            (state: Immutable<ParentCountModel>): Immutable<ParentCountModel> => ({ ...state, val: state.val + 1 })
        );
    }

    @DataAction()
    public countSubIncrement(): void {
        this.ctx.setState(
            (state: Immutable<ParentCountModel>): Immutable<ParentCountModel> => ({
                ...state,
                countSub: { val: state.countSub!.val + 1 }
            })
        );
    }

    @DataAction()
    public decrement(): void {
        this.setState(
            (state: Immutable<ParentCountModel>): Immutable<ParentCountModel> => ({ ...state, val: state.val - 1 })
        );
    }

    @Debounce()
    @DataAction()
    public setDebounceValue(@Payload('val') val: string | number): void {
        this.ctx.setState(
            (state: Immutable<ParentCountModel>): Immutable<ParentCountModel> => ({
                ...state,
                val: parseFloat(val as string) || 0
            })
        );
    }
}
