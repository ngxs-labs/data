import { action, NgxsDataRepository, StateRepository } from '@ngxs-labs/data';
import { Injectable } from '@angular/core';
import { State, StateToken } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ParentCountModel } from './count.model';
import { CountSubState } from './count-sub.state';
import { map } from 'rxjs/operators';
import { Immutable } from '@ngxs-labs/data/common';

const COUNT_TOKEN: StateToken<ParentCountModel> = new StateToken<ParentCountModel>('count');

@StateRepository()
@State<ParentCountModel>({
    name: COUNT_TOKEN,
    defaults: { val: 0 },
    children: [CountSubState]
})
@Injectable()
export class CountState extends NgxsDataRepository<ParentCountModel> {
    public readonly values$: Observable<ParentCountModel> = this.state$.pipe(map((state) => state.countSub!));

    @action() public increment(): void {
        this.ctx.setState((state: Immutable<ParentCountModel>) => ({ ...state, val: state.val + 1 }));
    }

    @action() public countSubIncrement(): void {
        this.ctx.setState((state) => ({
            ...state,
            countSub: { val: state.countSub!.val + 1 }
        }));
    }

    @action() public decrement(): void {
        this.setState((state) => ({ ...state, val: state.val - 1 }));
    }

    @action({ async: true, debounce: 300 }) public setValueFromInput(val: string | number): void {
        this.ctx.setState((state) => ({ ...state, val: parseFloat(val as string) || 0 }));
    }
}
