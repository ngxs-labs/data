import { NGXS_DATA_META } from '@ngxs-labs/data/tokens';
import { StateClassInternal } from '@ngxs/store/src/internal/internals';

export function defineDefaultRepositoryMeta(target: StateClassInternal): void {
    Object.defineProperty(target, NGXS_DATA_META, {
        writable: true,
        configurable: true,
        enumerable: true,
        value: { stateMeta: null, operations: {}, stateClass: target }
    });
}
