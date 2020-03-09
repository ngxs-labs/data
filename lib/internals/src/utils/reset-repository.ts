import { NgxsRepositoryMeta } from '@ngxs-labs/data/typings';
import { StateClassInternal } from '@ngxs/store/src/internal/internals';

import { getRepository } from './get-repository';

export function resetRepository<T>(target: StateClassInternal): void {
    const repository: NgxsRepositoryMeta<T> = getRepository(target);
    if (repository) {
        repository.operations = {};
        repository.stateMeta!.actions = {};
        repository.stateClass = target;
    }
}
