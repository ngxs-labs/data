import { PersistenceProvider } from "@ngxs-labs/data/typings";
import { getStateMetadata } from "@ngxs-labs/data/internals";

export function ensurePath(provider: PersistenceProvider): string {
    return provider.path ?? getStateMetadata(provider.stateClassRef!).path!
}
