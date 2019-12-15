import { action, Immutable, NgxsDataRepository, query, StateRepository } from '@ngxs-labs/data';
import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';

import { CountModel } from './count.model';

@StateRepository()
@State<CountModel>({
    name: 'count',
    defaults: { val: 0 }
})
@Injectable()
export class CountState extends NgxsDataRepository<CountModel> {
    @query<CountModel, number>((state) => state.val)
    public values$: Observable<number>;

    @action()
    public increment(): void {
        this.ctx.setState((state: Immutable<CountModel>) => ({ val: state.val + 1 }));
    }

    @action()
    public decrement(): void {
        this.setState((state: Immutable<CountModel>) => ({ val: state.val - 1 }));
    }

    @action({ async: true, debounce: 300 })
    public setValueFromInput(val: string | number): void {
        this.ctx.setState({ val: parseFloat(val as string) || 0 });
    }
}
