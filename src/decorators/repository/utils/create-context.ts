import { MappedStore } from '@ngxs/store/src/internal/internals';
import { StateClass } from '@ngxs/store/internals';
import { StateContext } from '@ngxs/store';

import { getRepository } from '../../../utils/internals/ensure-repository';
import { Any } from '../../../interfaces/internal.interface';
import { NgxsRepositoryMeta } from '../../../interfaces/external.interface';
import { NgxsDataAccessor } from '../../../services/ngxs-data-accessor';

export function createContext<T>(stateClass: StateClass): PropertyDescriptor {
    return {
        enumerable: true,
        configurable: true,
        get(): StateContext<Any> {
            const meta: NgxsRepositoryMeta = getRepository(stateClass);
            const mappedMeta: MappedStore | null | undefined = NgxsDataAccessor.ensureMappedState(meta.stateMeta);

            if (!mappedMeta) {
                throw new Error('Cannot create state context, because not found meta information');
            }

            return NgxsDataAccessor.createStateContext(mappedMeta);
        }
    };
}
