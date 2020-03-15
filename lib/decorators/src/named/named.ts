import { ensureMethodArgsRegistry, MethodArgsRegistry } from '@ngxs-labs/data/internals';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { DataStateClass, StateArgumentDecorator } from '@ngxs-labs/data/typings';

export function named(name: string): StateArgumentDecorator {
    return (stateClass: DataStateClass, methodName: string | symbol, parameterIndex: number): void => {
        const key: string = name.trim();

        if (!key) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_INVALID_ARG_NAME);
        }

        const registry: MethodArgsRegistry = ensureMethodArgsRegistry(stateClass, methodName);
        registry.createArgumentName(key, methodName as string, parameterIndex);
    };
}
