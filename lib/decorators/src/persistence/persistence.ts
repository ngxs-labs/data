import { ensureStateMetadata, getRepository, isNotNil } from '@ngxs-labs/data/internals';
import { setStorageOptions } from '@ngxs-labs/data/storage';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { Any, ClassType, NgxsRepositoryMeta, PersistenceProvider } from '@ngxs-labs/data/typings';
import { StateClass } from '@ngxs/store/internals';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';

export function Persistence(options?: PersistenceProvider[]) {
    return <T extends ClassType>(target: T) => {
        const stateClass: StateClass = target as Any;
        const stateMeta: MetaDataModel = ensureStateMetadata(stateClass);
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

        return class extends target {
            constructor(...args: Any[]) {
                super(...args);
                if (options) {
                    setStorageOptions(options);
                }
            }
        };
    };
}
