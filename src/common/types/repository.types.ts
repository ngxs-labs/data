import { Any, PlainObjectOf } from '@ngxs-labs/data/internals';
import { ActionOptions, ActionType } from '@ngxs/store';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import { Observable } from 'rxjs';

import { Immutable } from './immutability.types';

/**
 * @publicApi
 */
export interface NgxsDataOperation {
    type: string;
    argumentsNames: string[];
    options: ActionOptions;
}

/**
 * @publicApi
 */
export interface NgxsRepositoryMeta<T = Any> {
    stateMeta?: MetaDataModel;
    operations?: PlainObjectOf<NgxsDataOperation>;
}

/**
 * @publicApi
 */
export interface DataRepository<T> {
    name: string;
    initialState: Immutable<T>;
    state$: Observable<Immutable<T>>;

    getState(): Immutable<T>;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;

    patchState(val: Partial<T | Immutable<T>>): void;

    setState(stateValue: StateValue<T>): void;

    reset(): void;
}

/**
 * @publicApi
 */
export type DataPatchValue<T> = Partial<T | Immutable<T>>;
/**
 * @publicApi
 */
export type StateValue<T> = T | Immutable<T> | ((state: Immutable<T>) => Immutable<T> | T);

/**
 * @publicApi
 */
export interface ImmutableStateContext<T> {
    getState(): Immutable<T>;

    setState(val: StateValue<T>): void;

    patchState(val: DataPatchValue<T>): void;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;
}
