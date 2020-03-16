import { Injectable, isDevMode } from '@angular/core';
import { action, payload } from '@ngxs-labs/data/decorators';
import { ngxsDeepFreeze } from '@ngxs-labs/data/internals';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { DataRepository, DataStateContext, PatchValue, StateValue } from '@ngxs-labs/data/typings';
import { ActionType } from '@ngxs/store';
import { Observable } from 'rxjs';

@Injectable()
export abstract class NgxsDataRepository<T, U = DataStateContext<T>> implements DataStateContext<T>, DataRepository<T> {
    public readonly name: string;
    public readonly initialState: T;
    public readonly state$: Observable<T>;
    private readonly context: DataStateContext<T>;

    protected get ctx(): DataStateContext<T> {
        const context: DataStateContext<T> = this.context || null;

        if (!context) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
        }

        return {
            ...context,
            getState(): T {
                return isDevMode() ? ngxsDeepFreeze(context.getState()) : context.getState();
            },
            setState(val: T): void {
                context.setState(val);
            },
            patchState(val: PatchValue<T>): void {
                context.patchState(val);
            }
        };
    }

    public getState(): T {
        return this.ctx.getState();
    }

    public dispatch(actions: ActionType | ActionType[]): Observable<void> {
        return this.ctx.dispatch(actions);
    }

    @action()
    public patchState(@payload('patchValue') val: PatchValue<T>): void {
        this.ctx.patchState(val);
    }

    @action()
    public setState(@payload('stateValue') stateValue: StateValue<T>): void {
        this.ctx.setState(stateValue);
    }

    @action()
    public reset(): void {
        this.ctx.setState(this.initialState);
    }
}
