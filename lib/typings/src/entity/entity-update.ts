export interface EntityUpdate<V, K> {
    id: K;
    changes: Partial<V>;
}
