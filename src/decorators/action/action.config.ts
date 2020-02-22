import { RepositoryActionOptions } from '@ngxs-labs/data/common';

export const REPOSITORY_ACTION_OPTIONS: RepositoryActionOptions = {
    type: null,
    cancelUncompleted: true,
    async: false,
    debounce: 200
};
