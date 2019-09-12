import { action, Immutable, NgxsDataRepository, Repository } from '@ngxs-labs/data';
import { CountState } from './count.state';
import { CountModel } from './count.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Repository(CountState)
export class CountRepository extends NgxsDataRepository<CountModel> {
  public get value$(): Observable<number> {
    return this.state$.pipe(map((val: CountModel) => val.val));
  }

  @action()
  public increment(): Immutable<CountModel> {
    return this.ctx.setState((state: Immutable<CountModel>) => ({
      val: state.val + 1
    }));
  }

  @action()
  public decrement(): Immutable<CountModel> {
    return this.ctx.setState((state: Immutable<CountModel>) => ({
      val: state.val - 1
    }));
  }

  @action()
  public setValueFromInput(val: string): void {
    this.ctx.setState({ val: parseFloat(val) });
  }
}
