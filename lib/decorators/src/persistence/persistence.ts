import { ensureStateMetadata, getRepository, STORAGE_INIT_EVENT } from '@ngxs-labs/data/internals';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { DataStateClass, NgxsRepositoryMeta, PersistenceProvider, ProviderOptions } from '@ngxs-labs/data/typings';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import { Any } from "@angular-ru/common/typings";
import { ensureProviders, registerStorageProviders } from "@ngxs-labs/data/storage";

export function Persistence(options?: ProviderOptions): Any {
    return (stateClass: DataStateClass): void => {
        const stateMeta: MetaDataModel = ensureStateMetadata(stateClass);
        const repositoryMeta: NgxsRepositoryMeta = getRepository(stateClass);
        const isUndecoratedClass: boolean = !stateMeta.name || !repositoryMeta;

        if (isUndecoratedClass) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_STATE);
        }


        STORAGE_INIT_EVENT.events$.subscribe(() => {
            if (!STORAGE_INIT_EVENT.firstInitialized) {
                STORAGE_INIT_EVENT.firstInitialized = true;
            }

            const providers: PersistenceProvider[] = ensureProviders(repositoryMeta, stateClass, options);
            registerStorageProviders(providers);
        });
    };
}
