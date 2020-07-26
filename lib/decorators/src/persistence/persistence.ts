import { Any } from '@angular-ru/common/typings';
import { ensureStateMetadata, getRepository } from '@ngxs-labs/data/internals';
import { ensureProviders, registerStorageProviders } from '@ngxs-labs/data/storage';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { DataStateClass, NgxsRepositoryMeta, PersistenceProvider, ProviderOptions } from '@ngxs-labs/data/typings';
import { StateClass } from '@ngxs/store/internals';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';

export function Persistence(options?: ProviderOptions): Any {
    return (stateClass: DataStateClass): Any => {
        const stateMeta: MetaDataModel = ensureStateMetadata(stateClass);
        const repositoryMeta: NgxsRepositoryMeta = getRepository(stateClass);
        const isUndecoratedClass: boolean = !stateMeta.name || !repositoryMeta;

        if (isUndecoratedClass) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_STATE);
        }

        return new Proxy(stateClass, {
            construct(clazz: DataStateClass, args: Any[]): StateClass {
                const stateInstance: StateClass = Reflect.construct(clazz, args);
                const providers: PersistenceProvider[] = ensureProviders(repositoryMeta, stateInstance, options);
                registerStorageProviders(providers);
                return stateInstance;
            }
        });
    };
}
