import { action, Immutable, NgxsDataRepository, StateRepository } from '@ngxs-labs/data';
import { Injectable } from '@angular/core';
import { Select, State, StateToken } from '@ngxs/store';
import { Observable } from 'rxjs';

import { CountModel, ParentCountModel } from './count.model';
import { DeepCountState } from './deep-count.state';

const COUNT_TOKEN: StateToken<ParentCountModel> = new StateToken<ParentCountModel>('count');

@StateRepository()
@State<ParentCountModel>({
    name: COUNT_TOKEN,
    defaults: { val: 0 },
    children: [DeepCountState]
})
@Injectable()
export class CountState extends NgxsDataRepository<CountModel> {
    @Select((state: { count: ParentCountModel }) => state.count.deepCount)
    public values$: Observable<ParentCountModel>;

    @action()
    public increment(): void {
        this.ctx.setState((state: Immutable<ParentCountModel>) => ({ ...state, val: state.val + 1 }));
    }

    @action()
    public incrementDeep(): void {
        this.ctx.setState((state: Immutable<ParentCountModel>) => ({
            ...state,
            deepCount: { val: state.deepCount!.val + 1 }
        }));
    }

    @action()
    public decrement(): void {
        this.setState((state: Immutable<ParentCountModel>) => ({ ...state, val: state.val - 1 }));
    }

    @action({ async: true, debounce: 300 })
    public setValueFromInput(val: string | number): void {
        this.ctx.setState({ val: parseFloat(val as string) || 0 });
    }
}
