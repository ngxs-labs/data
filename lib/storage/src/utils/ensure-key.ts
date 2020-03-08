import { PersistenceProvider } from '@ngxs-labs/data/typings';

export function ensureKey(provider: PersistenceProvider): string {
    return `${provider.prefixKey}${provider.path}`;
}
