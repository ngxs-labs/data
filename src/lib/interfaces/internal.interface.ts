import { Immutable } from './external.interface';
import { ActionType } from '@ngxs/store';

export interface PlainObjectOf<T> {
    [key: string]: T;
}

// tslint:disable-next-line:no-any
export type Any = any;

export type Primitive = undefined | null | boolean | string | number | Function;

export interface DeepImmutableArray<T> extends ReadonlyArray<Immutable<T>> {}

export interface DeepImmutableMap<K, V> extends ReadonlyMap<Immutable<K>, Immutable<V>> {}

export type DeepImmutableObject<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
};

export type ActionEvent = ActionType & { payload: PlainObjectOf<Any> };
