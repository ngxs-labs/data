import { ActionType } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
    DataRepository,
    Immutable,
    ImmutableStateContext,
    NGXS_DATA_EXCEPTIONS,
    StateValue
} from '../interfaces/external.interface';
import { Any, PlainObjectOf } from '../interfaces/internal.interface';
import { action } from '../decorators/action/action';

export abstract class NgxsDataRepository<T> implements ImmutableStateContext<T>, DataRepository<T> {
    public readonly name: string;
    public readonly initialState: Immutable<T>;
    public readonly state$: Observable<Immutable<T>>;
    private context: ImmutableStateContext<T, Any>;

    protected get ctx(): ImmutableStateContext<T, Any> {
        const context: ImmutableStateContext<T, Any> = this.context || null;

        if (!context) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
        }

        return context;
    }

    public getState(): Immutable<T> {
        return this.ctx.getState();
    }

    public dispatch(actions: ActionType | ActionType[]): Observable<void> {
        return this.ctx.dispatch(actions);
    }

    @action()
    public patchState(val: Partial<T | Immutable<T>>): Immutable<T> {
        const value: Any = this.ctx.patchState(val as Any);
        return this.ensureStateValue(value);
    }

    @action()
    public setState(stateValue: StateValue<T>): Immutable<T> {
        const value: Any = this.ctx.setState(stateValue as Any);
        return this.ensureStateValue(value);
    }

    @action()
    public reset(): void {
        this.ctx.setState(this.initialState);
    }

    private ensureStateValue(val: Any): Immutable<T> {
        const result: PlainObjectOf<Immutable<T>> = (val as PlainObjectOf<Immutable<T>>) || null;
        return result ? result[this.name] : undefined;
    }
}
