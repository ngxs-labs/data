import { ensurePayloadRegistry, PayloadRegistry } from '@ngxs-labs/data/internals';
import { DataStateClass, StatePayloadDecorator } from '@ngxs-labs/data/typings';

export function payload(name: string): StatePayloadDecorator {
    return (stateClass: DataStateClass, propertyKey: string | symbol, parameterIndex: number): void => {
        const registry: PayloadRegistry = ensurePayloadRegistry(stateClass, propertyKey);
        registry.create(propertyKey as string, name, parameterIndex);
    };
}
