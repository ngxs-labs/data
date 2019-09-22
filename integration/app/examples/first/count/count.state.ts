import { action, Immutable, NgxsDataRepository, StateRepository } from '@ngxs-labs/data';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';

import { CountModel } from './count.model';

@Injectable()
@StateRepository()
@State<CountModel>({
  name: 'count',
  defaults: { val: 0 }
})
export class CountState extends NgxsDataRepository<CountModel> {
  public get value$(): Observable<number> {
    return this.state$.pipe(map((val: CountModel) => val.val));
  }

  @action()
  public increment(): Immutable<CountModel> {
    return this.ctx.setState((state: Immutable<CountModel>) => ({ val: state.val + 1 }));
  }

  @action()
  public decrement(): Immutable<CountModel> {
    return this.setState((state: Immutable<CountModel>) => ({ val: state.val - 1 }));
  }

  @action()
  public setValueFromInput(val: string): void {
    this.ctx.setState({ val: parseFloat(val) });
  }
}
