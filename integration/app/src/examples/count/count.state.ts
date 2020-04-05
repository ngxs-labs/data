import { Injectable } from '@angular/core';
import { Computed, DataAction, Debounce, Payload, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { Immutable } from '@ngxs-labs/data/typings';
import { State, StateToken } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CountSubState } from './count-sub.state';
import { CountModel, ParentCountModel } from './count.model';

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
    public get values$(): Observable<ParentCountModel> {
        return this.state$.pipe(map((state: Immutable<ParentCountModel>): CountModel => state.countSub!));
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
