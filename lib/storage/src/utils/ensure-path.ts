import { getStateMetadata } from '@ngxs-labs/data/internals';
import { PersistenceProvider } from '@ngxs-labs/data/typings';

export function ensurePath(provider: PersistenceProvider): string {
    return provider.path ?? getStateMetadata(provider.stateClassRef!).path!;
}
