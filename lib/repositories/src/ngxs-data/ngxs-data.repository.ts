import { Injectable } from '@angular/core';
import { Computed, DataAction, Payload } from '@ngxs-labs/data/decorators';
import { ensureDataStateContext, ensureSnapshot } from '@ngxs-labs/data/internals';
import { DataRepository, DataStateContext, PatchValue, StateValue } from '@ngxs-labs/data/typings';
import { ActionType, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';

import { AbstractRepository } from '../common/abstract-repository';

@Injectable()
export abstract class NgxsDataRepository<T> extends AbstractRepository<T>
    implements DataStateContext<T>, DataRepository<T> {
    private readonly context: DataStateContext<T>;

    @Computed()
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
    public patchState(@Payload('patchValue') val: PatchValue<T>): void {
        this.ctx.patchState(val);
    }

    @DataAction()
    public setState(@Payload('stateValue') stateValue: StateValue<T>): void {
        this.ctx.setState(stateValue);
    }

    @DataAction()
    public reset(): void {
        this.ctx.setState(this.initialState);
        this.markAsDirtyAfterReset();
    }
}
