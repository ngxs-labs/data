import { MappedStore } from '@ngxs/store/src/internal/internals';
import { StateContext } from '@ngxs/store';

import { getRepository } from '../../../internals/ensure-repository';
import { NgxsDataAccessor } from '../../../services/data-access-injector.service';
import { Any } from '../../../interfaces/internal.interface';
import { NgxsRepositoryMeta } from '../../../interfaces/external.interface';

export function createContext<T>(stateClass: Function): PropertyDescriptor {
    return {
        enumerable: true,
        configurable: true,
        get(): StateContext<Any> {
            const meta: NgxsRepositoryMeta = getRepository(stateClass);
            const mappedMeta: MappedStore = NgxsDataAccessor.ensureMappedState(meta.stateMeta);
            return NgxsDataAccessor.createStateContext(mappedMeta);
        }
    };
}
