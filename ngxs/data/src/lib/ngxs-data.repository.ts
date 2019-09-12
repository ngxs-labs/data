import { ActionType } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  Any,
  Immutable,
  ImmutableStateContext,
  NgxsData,
  PatchValue,
  SetValue,
  StateContextResult
} from './symbols';
import { action } from './decorators/operation/action';

export abstract class NgxsDataRepository<T> implements ImmutableStateContext<T>, NgxsData<T> {
  public readonly name: string;
  public readonly initialState: Immutable<T>;
  public readonly state$: Observable<Immutable<T>>;
  protected readonly ctx: ImmutableStateContext<T>;

  public getState(): Immutable<T> {
    return this.ctx.getState();
  }

  public dispatch(actions: ActionType | ActionType[]): Observable<void> {
    return this.ctx.dispatch(actions);
  }

  @action()
  public patchState(val: PatchValue<T>): Immutable<T> {
    const value: Any = this.ctx.patchState(val as Any);
    return this.ensureStateValue(value);
  }

  @action()
  public setState(val: SetValue<T>): Immutable<T> {
    const value: Any = this.ctx.setState(val as Any);
    return this.ensureStateValue(value);
  }

  @action()
  public reset(): void {
    this.ctx.setState(this.initialState);
  }

  private ensureStateValue(val: Any): Immutable<T> {
    let value: Any = val as Any;
    const result: StateContextResult<Immutable<T>> =
      (value as StateContextResult<Immutable<T>>) || null;
    return result ? result[this.name] : undefined;
  }
}
