import { MetaDataModel, StateClassInternal } from '@ngxs/store/src/internal/internals';
import { ensureStoreMetadata } from '@ngxs/store';

import { Any } from '../../interfaces/internal.interface';
import { NGXS_DATA_EXCEPTIONS, NgxsRepositoryMeta, PersistenceProvider } from '../../interfaces/external.interface';
import { getRepository } from '../../internals/ensure-repository';
import { NgxsDataStorageEngine } from '../../services/ngxs-data-storage-engine';
import { isNotNil } from '../../internals/utils';

export function Persistence(options?: PersistenceProvider[]): ClassDecorator {
    return <TFunction extends Function>(stateClass: TFunction): TFunction | void => {
        const stateMeta: MetaDataModel = ensureStoreMetadata((stateClass as Any) as StateClassInternal);
        const repositoryMeta: NgxsRepositoryMeta = getRepository(stateClass);
        const isUndecoratedClass: boolean = !stateMeta.name || !repositoryMeta;
        const defaultPrefix: string = '@ngxs.store.';
        const defaultDecode: 'none' = 'none';

        if (isUndecoratedClass) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_STATE);
        }

        if (!options) {
            options = [
                {
                    get path(): string {
                        return repositoryMeta.stateMeta.path;
                    },
                    existingEngine: localStorage,
                    ttl: -1,
                    version: 1,
                    decode: defaultDecode,
                    prefixKey: defaultPrefix,
                    nullable: false
                }
            ];
        } else {
            options = options.map((option: PersistenceProvider) => ({
                ...option,
                ttl: isNotNil(option.ttl) ? option.ttl : -1,
                version: isNotNil(option.version) ? option.version : 1,
                decode: isNotNil(option.decode) ? option.decode : defaultDecode,
                prefixKey: isNotNil(option.prefixKey) ? option.prefixKey : defaultPrefix,
                nullable: isNotNil(option.nullable) ? option.nullable : false
            }));
        }

        options.forEach((option: PersistenceProvider) => NgxsDataStorageEngine.providers.add(option));
    };
}
