import { Injectable } from '@angular/core';
import { Computed, DataAction, Payload } from '@ngxs-labs/data/decorators';
import { ensureDataStateContext, ensureSnapshot } from '@ngxs-labs/data/internals';
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

import { AbstractRepository } from '../common/abstract-repository';

@Injectable()
export abstract class NgxsImmutableDataRepository<T> extends AbstractRepository<Immutable<T>>
    implements ImmutableStateContext<T>, ImmutableDataRepository<T> {
    private readonly context: ImmutableStateContext<T>;

    @Computed()
    public get snapshot(): Immutable<T> {
        return ensureSnapshot(this.getState());
    }

    protected get ctx(): ImmutableStateContext<T> {
        return ensureDataStateContext<T, Any>(this, this.context);
    }

    public getState(): Immutable<T> {
        return this.ctx.getState();
    }

    public dispatch(actions: ActionType | ActionType[]): Observable<void> {
        return this.ctx.dispatch(actions);
    }

    @DataAction()
    public patchState(@Payload('patchValue') val: ImmutablePatchValue<T>): void {
        this.ctx.patchState(val);
    }

    @DataAction()
    public setState(@Payload('stateValue') stateValue: ImmutableStateValue<T>): void {
        this.ctx.setState(stateValue);
    }

    @DataAction()
    public reset(): void {
        this.ctx.setState(this.initialState);
        this.markAsDirtyAfterReset();
    }
}
