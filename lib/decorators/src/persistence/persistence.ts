import { ensureStateMetadata, getRepository } from '@ngxs-labs/data/internals';
import { ensureProviders, registerStorageProviders } from '@ngxs-labs/data/storage';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { Any, ClassType, DataStateClass, NgxsRepositoryMeta, PersistenceProvider } from '@ngxs-labs/data/typings';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';

export function Persistence(options?: PersistenceProvider[] | PersistenceProvider): Any {
    return <T extends ClassType>(target: T): Any => {
        const stateClass: DataStateClass = target as Any;
        const stateMeta: MetaDataModel = ensureStateMetadata(stateClass);
        const repositoryMeta: NgxsRepositoryMeta = getRepository(stateClass);
        const isUndecoratedClass: boolean = !stateMeta.name || !repositoryMeta;

        if (isUndecoratedClass) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_STATE);
        }

        return class extends target {
            constructor(...args: Any[]) {
                super(...args);
                const providers: PersistenceProvider[] = ensureProviders(repositoryMeta, options);
                registerStorageProviders(providers);
            }
        };
    };
}
