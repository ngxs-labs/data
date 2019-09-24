import { Injectable, Injector } from '@angular/core';
import {
  StateContext,
  Store,
  ɵn as StateFactory,
  ɵq as StateContextFactory
} from '@ngxs/store';
import { MappedStore, MetaDataModel } from '@ngxs/store/src/internal/internals';

import { getRepository } from '../internals/ensure-repository';
import { Any, PlainObjectOf } from '../interfaces/internal.interface';
import {
  NGXS_DATA_EXCEPTIONS,
  NgxsDataOperation,
  NgxsRepositoryMeta
} from '../interfaces/external.interface';

@Injectable()
export class NgxsDataAccessor {
  public static store: Store | null = null;
  public static factoryRef: typeof StateFactory | null = null;
  public static contextRef: typeof StateContextFactory | null = null;
  public static context: StateContextFactory | null = null;
  public static factory: StateFactory | null = null;
  private static readonly statesCachedMeta: Map<string, MappedStore> = new Map();

  constructor(injector: Injector) {
    NgxsDataAccessor.statesCachedMeta.clear();
    NgxsDataAccessor.store = injector.get<Store>(Store);
    NgxsDataAccessor.factory = NgxsDataAccessor.factoryRef
      ? injector.get<Any>(NgxsDataAccessor.factoryRef)
      : injector.get<StateFactory>(StateFactory);
    NgxsDataAccessor.context = NgxsDataAccessor.contextRef
      ? injector.get<Any>(NgxsDataAccessor.contextRef)
      : injector.get<StateContextFactory>(StateContextFactory);
  }

  public static createStateContext<T>(metadata: MappedStore): StateContext<T> {
    return NgxsDataAccessor.context.createStateContext(metadata);
  }

  public static ensureMappedState(stateMeta: MetaDataModel): MappedStore {
    if (!NgxsDataAccessor.factory) {
      throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
    }

    const cachedMeta: MappedStore =
      NgxsDataAccessor.statesCachedMeta.get(stateMeta.name) || null;

    if (!cachedMeta) {
      const meta: MappedStore = NgxsDataAccessor.factory.states.find(
        state => state.name === stateMeta.name
      );

      NgxsDataAccessor.statesCachedMeta.set(stateMeta.name, meta);

      return meta;
    }

    return cachedMeta;
  }

  public static getRepositoryByInstance(target: Any): NgxsRepositoryMeta {
    const repository: NgxsRepositoryMeta = getRepository((target || {})['constructor']);

    if (!repository) {
      throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
    }

    return repository;
  }

  public static createPayload(
    args: IArguments,
    operation: NgxsDataOperation
  ): PlainObjectOf<Any> {
    const payload: PlainObjectOf<Any> = {};
    const arrayArgs: Array<Any> = Array.from(args);
    operation.argumentsNames.forEach((arg: string, index: number) => {
      payload[arg] = arrayArgs[index];
    });

    return payload;
  }
}
