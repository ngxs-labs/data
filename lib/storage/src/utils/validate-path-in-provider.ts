import { NgxsRepositoryMeta, PersistenceProvider } from '@ngxs-labs/data/typings';

export function validatePathInProvider(meta: NgxsRepositoryMeta, provider: PersistenceProvider): PersistenceProvider {
    if (!('path' in provider)) {
        provider = {
            ...provider,
            get path(): string | null | undefined {
                return meta?.stateMeta?.path;
            }
        };
    }

    return provider;
}
