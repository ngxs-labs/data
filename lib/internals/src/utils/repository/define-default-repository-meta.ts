import { NGXS_DATA_META } from '@ngxs-labs/data/tokens';
import { DataStateClass } from '@ngxs-labs/data/typings';

export function defineDefaultRepositoryMeta(target: DataStateClass): void {
    Object.defineProperty(target, NGXS_DATA_META, {
        writable: true,
        configurable: true,
        enumerable: true,
        value: { stateMeta: null, operations: {}, stateClass: target }
    });
}
