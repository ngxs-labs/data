import { Injectable } from '@angular/core';
import { action, payload } from '@ngxs-labs/data/decorators';
import { ensureDataStateContext } from '@ngxs-labs/data/internals';
import {
    Any,
    Immutable,
    ImmutableDataRepository,
    ImmutablePatchValue,
    ImmutableStateContext,
    ImmutableStateValue
} from '@ngxs-labs/data/typings';
import { ActionType } from '@ngxs/store';
import { Observable } from 'rxjs';

@Injectable()
export abstract class NgxsImmutableDataRepository<T> implements ImmutableStateContext<T>, ImmutableDataRepository<T> {
    public readonly name: string;
    public readonly initialState: Immutable<T>;
    public readonly state$: Observable<Immutable<T>>;
    private readonly context: ImmutableStateContext<T>;

    protected get ctx(): ImmutableStateContext<T> {
        return ensureDataStateContext<T, Any>(this, this.context);
    }

    public getState(): Immutable<T> {
        return this.ctx.getState();
    }

    public dispatch(actions: ActionType | ActionType[]): Observable<void> {
        return this.ctx.dispatch(actions);
    }

    @action()
    public patchState(@payload('patchValue') val: ImmutablePatchValue<T>): void {
        this.ctx.patchState(val);
    }

    @action()
    public setState(@payload('stateValue') stateValue: ImmutableStateValue<T>): void {
        this.ctx.setState(stateValue);
    }

    @action()
    public reset(): void {
        this.ctx.setState(this.initialState);
    }
}
