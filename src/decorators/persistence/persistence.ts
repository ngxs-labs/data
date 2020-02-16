import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import { StateClass } from '@ngxs/store/internals';
import { ensureStoreMetadata } from '@ngxs/store';

import { Any, NGXS_DATA_EXCEPTIONS } from '../../interfaces/internal.interface';
import { NgxsRepositoryMeta, PersistenceProvider } from '../../interfaces/external.interface';
import { getRepository } from '../../utils/internals/ensure-repository';
import { NgxsDataStorageEngine } from '../../services/ngxs-data-storage-engine';
import { isNotNil } from '../../utils/internals/utils';

export function Persistence(options?: PersistenceProvider[]): ClassDecorator {
    return <TFunction extends Function>(stateClass: TFunction): TFunction | void => {
        const stateMeta: MetaDataModel = ensureStoreMetadata((stateClass as Any) as StateClass);
        const repositoryMeta: NgxsRepositoryMeta = getRepository((stateClass as Any) as StateClass);
        const isUndecoratedClass: boolean = !stateMeta.name || !repositoryMeta;
        const defaultPrefix: string = '@ngxs.store.';
        const defaultDecode: 'none' = 'none';

        if (isUndecoratedClass) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_STATE);
        }

        if (!options) {
            options = [
                {
                    get path(): string | null | undefined {
                        return repositoryMeta.stateMeta && repositoryMeta.stateMeta.path;
                    },
                    existingEngine: localStorage,
                    ttl: -1,
                    version: 1,
                    decode: defaultDecode,
                    prefixKey: defaultPrefix,
                    nullable: false
                }
            ] as PersistenceProvider[];
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
