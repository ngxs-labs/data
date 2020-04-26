export type EntityIdType = string | number;

export type EntityDictionary<K extends string | number, V> = {
    [key in K]: V;
};

export type EmptyDictionary<K extends string | number, V> = {
    [key in K]?: V;
};

export type EntityStateValue<T> = T | ((state: T) => T);

export type EntityPatchValue<T> = Partial<T>;

export type KeysDictionary<K extends string | number> = { [key in K]?: K };
