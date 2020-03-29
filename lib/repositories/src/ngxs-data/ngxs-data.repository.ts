import { Injectable } from '@angular/core';
import { computed, DataAction, payload } from '@ngxs-labs/data/decorators';
import { ensureDataStateContext, ensureSnapshot } from '@ngxs-labs/data/internals';
import { DataRepository, DataStateContext, PatchValue, StateValue } from '@ngxs-labs/data/typings';
import { ActionType, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';

@Injectable()
export abstract class NgxsDataRepository<T, U = DataStateContext<T>> implements DataStateContext<T>, DataRepository<T> {
    public readonly name: string;
    public readonly initialState: T;
    public readonly state$: Observable<T>;
    private readonly context: DataStateContext<T>;

    @computed()
    public get snapshot(): T {
        return ensureSnapshot(this.getState());
    }

    protected get ctx(): DataStateContext<T> {
        return ensureDataStateContext<T, StateContext<T>>(this, this.context as StateContext<T>);
    }

    public getState(): T {
        return this.ctx.getState();
    }

    public dispatch(actions: ActionType | ActionType[]): Observable<void> {
        return this.ctx.dispatch(actions);
    }

    @DataAction()
    public patchState(@payload('patchValue') val: PatchValue<T>): void {
        this.ctx.patchState(val);
    }

    @DataAction()
    public setState(@payload('stateValue') stateValue: StateValue<T>): void {
        this.ctx.setState(stateValue);
    }

    @DataAction()
    public reset(): void {
        this.ctx.setState(this.initialState);
    }
}
