import { NGXS_DATA_EXCEPTIONS, NgxsRepositoryMeta, PersistenceProvider } from '@ngxs-labs/data/common';
import { Any, isNotNil } from '@ngxs-labs/data/internals';
import { StateClass } from '@ngxs/store/internals';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';

import { NgxsDataStorageEngine } from '../../services/ngxs-data-storage-engine';
import { getRepository } from '../../internals/utils/ensure-repository';
import { ensureStateMetadata } from '../../internals/utils/ensure-state-metadata';

export function Persistence(options?: PersistenceProvider[]): ClassDecorator {
    return <TFunction extends Function>(stateClass: TFunction): TFunction | void => {
        const stateMeta: MetaDataModel = ensureStateMetadata((stateClass as Any) as StateClass);
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
