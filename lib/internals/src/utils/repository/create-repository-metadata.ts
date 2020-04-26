import { DataStateClass, NgxsRepositoryMeta } from '@ngxs-labs/data/typings';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';

import { ensureRepository } from './ensure-repository';

/**
 * @description need mutate metadata for correct reference
 */
export function createRepositoryMetadata(target: DataStateClass, stateMeta: MetaDataModel): void {
    const repositoryMeta: NgxsRepositoryMeta = ensureRepository(target);
    repositoryMeta.stateMeta = stateMeta;
}
