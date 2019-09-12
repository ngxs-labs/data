import { MappedStore } from '@ngxs/store/src/internal/internals';
import { StateContext } from '@ngxs/store';
import { Type } from '@angular/core';

import { getRepository } from './ensure-repository';
import { Any, NgxsRepositoryMeta } from '../../symbols';
import { getStateFromFactory } from '../../internals/get-state-from-factory';
import { NgxsDataPluginModule } from '../../ngxs-data.module';

export function createContext<T>(repository: Type<Any>): PropertyDescriptor {
  return {
    enumerable: true,
    configurable: true,
    get(): StateContext<Any> {
      let mappedMeta: MappedStore = repository['__mappedMeta__'];

      if (!mappedMeta) {
        const meta: NgxsRepositoryMeta = getRepository(repository);
        mappedMeta = repository['__mappedMeta__'] = getStateFromFactory(meta.stateMeta);

        if (!mappedMeta) {
          throw new Error(
            'You forgot add state to store! \n Example: NgxsModule.forRoot([ .. ]), or NgxsModule.forFeature([ .. ])'
          );
        }
      }

      return NgxsDataPluginModule.contextFactory.createStateContext(mappedMeta);
    }
  };
}
