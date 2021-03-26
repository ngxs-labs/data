import { PersistenceProvider } from '@ngxs-labs/data/typings';
import { ensurePath } from "./ensure-path";

export function ensureKey(provider: PersistenceProvider): string {
    return `${provider.prefixKey}${ensurePath(provider)}`;
}
