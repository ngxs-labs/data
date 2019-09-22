import { MetaDataModel } from '@ngxs/store/src/internal/internals';

import { ensureRepository } from '../../../internals/ensure-repository';
import { NgxsRepositoryMeta } from '../../../interfaces/external.interface';

/**
 * @description need mutate metadata for correct reference
 */
export function createRepositoryMetadata<T>(target: Function, stateMeta: MetaDataModel): void {
  const repositoryMeta: NgxsRepositoryMeta<T> = ensureRepository(target);
  repositoryMeta.stateMeta = stateMeta;
}
