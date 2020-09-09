import { Any } from '@angular-ru/common/typings';
import { ensureStateMetadata, getRepository } from '@ngxs-labs/data/internals';
import { ensureProviders, registerStorageProviders } from '@ngxs-labs/data/storage';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { DataStateClass, NgxsRepositoryMeta, ProviderOptions } from '@ngxs-labs/data/typings';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';

export function Persistence(options?: ProviderOptions): Any {
    // eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/tslint/config
    return function <T extends DataStateClass>(stateClass: T) {
        return class extends stateClass {
            constructor(...args: Any[]) {
                super(args);

                const stateMeta: MetaDataModel = ensureStateMetadata(stateClass);
                const repositoryMeta: NgxsRepositoryMeta = getRepository(stateClass);
                const isUndecoratedClass: boolean = !stateMeta.name || !repositoryMeta;

                if (isUndecoratedClass) {
                    throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_STATE);
                }

                registerStorageProviders(ensureProviders(repositoryMeta, this as Any, options));
            }
        };
    };
}
