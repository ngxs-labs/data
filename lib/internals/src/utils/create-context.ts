import { Any, NgxsRepositoryMeta } from '@ngxs-labs/data/typings';
import { StateContext } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import { MappedStore } from '@ngxs/store/src/internal/internals';

import { NgxsDataFactory } from '../services/ngxs-data-factory.service';
import { getRepository } from './get-repository';

export function createContext<T>(stateClass: StateClass): PropertyDescriptor {
    return {
        enumerable: true,
        configurable: true,
        get(): StateContext<Any> {
            const meta: NgxsRepositoryMeta = getRepository(stateClass);
            const mappedMeta: MappedStore | null | undefined = NgxsDataFactory.ensureMappedState(meta.stateMeta);

            if (!mappedMeta) {
                throw new Error('Cannot create state context, because not found meta information');
            }

            return NgxsDataFactory.createStateContext(mappedMeta);
        }
    };
}
