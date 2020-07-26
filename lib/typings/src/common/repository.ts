import { Immutable, PlainObjectOf } from '@angular-ru/common/typings';
import { ActionOptions, ActionType } from '@ngxs/store';
import { MetaDataModel, StateClassInternal } from '@ngxs/store/src/internal/internals';
import { Observable } from 'rxjs';

/**
 * @publicApi
 */
export interface NgxsDataOperation {
    type: string;
    options: ActionOptions;
}

/**
 * @publicApi
 */
export interface NgxsRepositoryMeta {
    stateMeta?: MetaDataModel;
    operations?: PlainObjectOf<NgxsDataOperation>;
    stateClass?: StateClassInternal;
}

export interface ImmutableDataRepository<T> {
    name: string;
    initialState: Immutable<T>;
    state$: Observable<Immutable<T>>;
    readonly snapshot: Immutable<T>;

    getState(): Immutable<T>;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;

    patchState(val: ImmutablePatchValue<T>): void;

    setState(stateValue: ImmutableStateValue<T>): void;

    reset(): void;
}

export type ImmutablePatchValue<T> = Partial<T | Immutable<T>>;
export type ImmutableStateValue<T> = T | Immutable<T> | ((state: Immutable<T>) => Immutable<T> | T);

export interface ImmutableStateContext<T> {
    getState(): Immutable<T>;

    setState(val: ImmutableStateValue<T>): void;

    patchState(val: ImmutablePatchValue<T>): void;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;
}

export interface DataRepository<T> {
    name: string;
    initialState: T;
    state$: Observable<T>;
    readonly snapshot: T;

    getState(): T;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;

    patchState(val: PatchValue<T>): void;

    setState(stateValue: StateValue<T>): void;

    reset(): void;
}

export type PatchValue<T> = Partial<T | Immutable<T>>;
export type StateValue<T> = T | Immutable<T> | ((state: T) => T | Immutable<T>);

export interface DataStateContext<T> {
    getState(): T;

    setState(val: StateValue<T>): void;

    patchState(val: PatchValue<T>): void;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;
}
