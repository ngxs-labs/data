import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import { StateClass } from '@ngxs/store/internals';
import { Injectable, Type } from '@angular/core';
import { ensureStoreMetadata, StateContext } from '@ngxs/store';

import { NgxsDataPluginModule } from '../../ngxs-data.module';
import { createRepositoryMetadata } from './create-repository-metadata';
import { createStateSelector } from './create-state-selector';
import { createContext } from './create-context';
import { Any } from '../../symbols';
import { clone } from '../../internals/clone';

export function Repository<T>(stateClass: StateClass<T>) {
  return (target: Type<Any>) => {
    Injectable({ providedIn: NgxsDataPluginModule })(target);
    const stateMeta: MetaDataModel = ensureStoreMetadata(stateClass);

    createRepositoryMetadata(target, stateMeta);
    const cloneDefaults: Any = clone(stateMeta.defaults);

    Object.defineProperties(target.prototype, {
      name: { enumerable: true, configurable: true, value: stateMeta.name },
      initialState: {
        enumerable: true,
        configurable: true,
        get(): Any {
          return cloneDefaults;
        }
      },
      ctx: createContext<T>(target),
      state$: createStateSelector({ target, stateClass })
    });
  };
}
