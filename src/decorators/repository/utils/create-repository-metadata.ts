import { MetaDataModel, StateClassInternal } from '@ngxs/store/src/internal/internals';

import { NgxsRepositoryMeta } from '../../../interfaces/external.interface';
import { ensureRepository } from '../../../utils/internals/ensure-repository';

/**
 * @description need mutate metadata for correct reference
 */
export function createRepositoryMetadata<T>(target: StateClassInternal, stateMeta: MetaDataModel): void {
    const repositoryMeta: NgxsRepositoryMeta<T> = ensureRepository(target);
    repositoryMeta.stateMeta = stateMeta;
}
