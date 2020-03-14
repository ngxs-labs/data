import { Injectable } from '@angular/core';
import { action, debounce, payload, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
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
export class CountState extends NgxsDataRepository<ParentCountModel> {
    public readonly values$: Observable<ParentCountModel> = this.state$.pipe(
        map((state: Immutable<ParentCountModel>): CountModel => state.countSub!)
    );

    // @action()
    public increment(@payload('fuck') fuck: any): void {
        this.setState(
            (state: Immutable<ParentCountModel>): Immutable<ParentCountModel> => ({ ...state, val: state.val + 1 })
        );
    }

    @action()
    public countSubIncrement(): void {
        this.ctx.setState(
            (state: Immutable<ParentCountModel>): Immutable<ParentCountModel> => ({
                ...state,
                countSub: { val: state.countSub!.val + 1 }
            })
        );
    }

    @action()
    public decrement(): void {
        this.setState(
            (state: Immutable<ParentCountModel>): Immutable<ParentCountModel> => ({ ...state, val: state.val - 1 })
        );
    }

    @debounce()
    @action()
    public setDebounceValue(@payload('value') val: string | number): void {
        this.ctx.setState(
            (state: Immutable<ParentCountModel>): Immutable<ParentCountModel> => ({
                ...state,
                val: parseFloat(val as string) || 0
            })
        );
    }
}
