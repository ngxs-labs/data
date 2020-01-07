import { ActionType } from '@ngxs/store';
import { Observable } from 'rxjs';

import { DataRepository, Immutable, ImmutableStateContext, StateValue } from '../interfaces/external.interface';
import { action } from '../decorators/action/action';
import { NGXS_DATA_EXCEPTIONS } from '../interfaces/internal.interface';

export abstract class NgxsDataRepository<T> implements ImmutableStateContext<T>, DataRepository<T> {
    public readonly name: string;
    public readonly initialState: Immutable<T>;
    public readonly state$: Observable<Immutable<T>>;
    private context: ImmutableStateContext<T>;

    protected get ctx(): ImmutableStateContext<T> {
        const context: ImmutableStateContext<T> = this.context || null;

        if (!context) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
        }

        return {
            ...context,
            setState(val: StateValue<T>): void {
                context.setState(val);
            },
            patchState(val: Partial<T | Immutable<T>>): void {
                context.patchState(val);
            }
        };
    }

    public getState(): Immutable<T> {
        return this.ctx.getState();
    }

    public dispatch(actions: ActionType | ActionType[]): Observable<void> {
        return this.ctx.dispatch(actions);
    }

    @action()
    public patchState(val: Partial<T | Immutable<T>>): void {
        this.ctx.patchState(val);
    }

    @action()
    public setState(stateValue: StateValue<T>): void {
        this.ctx.setState(stateValue);
    }

    @action()
    public reset(): void {
        this.ctx.setState(this.initialState);
    }
}
