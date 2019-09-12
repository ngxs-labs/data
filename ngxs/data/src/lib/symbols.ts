import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import { ActionOptions, ActionType } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import { Type } from '@angular/core';
import { Observable } from 'rxjs';

export const NGXS_DATA_META: string = 'NGXS_DATA_META';

export interface PlainObjectOf<T> {
  [key: string]: T;
}

export type Any = any;

export interface NgxsRepositoryMeta<T = Any> {
  stateMeta?: MetaDataModel;
  operations?: PlainObjectOf<NgxsDataOperation>;
}

export interface MetaProperty<T = Any> {
  target: Type<Any>;
  stateClass: StateClass<T>;
}

export interface NgxsDataOperation {
  type: string;
  methodFn: Function;
  argumentsNames: string[];
  options: OperationOptions;
}

export interface OperationOptions extends ActionOptions {}

export interface StateContextResult<T> {
  [key: string]: T;
}

type Primitive = undefined | null | boolean | string | number | Function;

export type Immutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? DeepImmutableArray<U>
  : T extends Map<infer K, infer V>
  ? DeepImmutableMap<K, V>
  : T extends object
  ? DeepImmutableObject<T>
  : unknown;

interface DeepImmutableArray<T> extends ReadonlyArray<Immutable<T>> {}

interface DeepImmutableMap<K, V> extends ReadonlyMap<Immutable<K>, Immutable<V>> {}

type DeepImmutableObject<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
};

export interface NgxsData<T> {
  name: string;
  initialState: Immutable<T>;
  state$: Observable<Immutable<T>>;
}

export type ImmutableStateOperator<T> = (state: Immutable<T>) => T;
export type SetValue<T> = T | Immutable<T> | ImmutableStateOperator<Immutable<T>>;
export type PatchValue<T> = Partial<T | Immutable<T>>;

export interface ImmutableStateContext<T> {
  getState(): Immutable<T>;

  setState(val: SetValue<T>): Immutable<T>;

  patchState(val: PatchValue<T>): Immutable<T>;

  dispatch(actions: ActionType | ActionType[]): Observable<void>;
}
