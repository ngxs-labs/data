type PrimitiveType = undefined | null | boolean | string | number | Function;

/**
 * @publicApi
 */
export type Immutable<T> = { readonly [K in keyof T]: T[K] extends PrimitiveType ? T[K] : Immutable<T[K]> };

/**
 * @publicApi
 */
export type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> };
