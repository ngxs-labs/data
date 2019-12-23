import { ActionType, Store } from '@ngxs/store';
import { Immutable, PersistenceProvider } from './external.interface';

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

export interface RootInternalStorageEngine {
    readonly size: number;
    readonly store: Store | null;
    readonly providers: Set<PersistenceProvider>;
    readonly entries: IterableIterator<[PersistenceProvider, PersistenceProvider]>;

    serialize(data: Any, provider: PersistenceProvider): string;

    deserialize(value: string | undefined): string | undefined;

    ensureKey(provider: PersistenceProvider): string;
}
