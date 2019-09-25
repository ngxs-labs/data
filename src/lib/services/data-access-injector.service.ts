import { MappedStore, MetaDataModel } from '@ngxs/store/src/internal/internals';
import { Inject, Injectable, Injector, NgZone } from '@angular/core';
import { StateContext, Store } from '@ngxs/store';

import { getRepository } from '../internals/ensure-repository';
import { Any, PlainObjectOf, STATE_CONTEXT_FACTORY, STATE_FACTORY } from '../interfaces/internal.interface';
import { NGXS_DATA_EXCEPTIONS, NgxsDataOperation, NgxsRepositoryMeta } from '../interfaces/external.interface';

@Injectable()
export class NgxsDataAccessor {
    public static store: Store | null = null;
    public static context: Any | null = null;
    public static factory: Any | null = null;
    public static ngZone: NgZone | null = null;
    private static readonly statesCachedMeta: Map<string, MappedStore> = new Map();

    constructor(
        injector: Injector,
        @Inject(STATE_FACTORY) stateFactoryRef: Any,
        @Inject(STATE_CONTEXT_FACTORY) stateContextFactoryRef
    ) {
        NgxsDataAccessor.statesCachedMeta.clear();
        NgxsDataAccessor.store = injector.get<Store>(Store);
        NgxsDataAccessor.factory = injector.get<Any>(stateFactoryRef);
        NgxsDataAccessor.context = injector.get<Any>(stateContextFactoryRef);
        NgxsDataAccessor.ngZone = injector.get<NgZone>(NgZone);
    }

    public static createStateContext<T>(metadata: MappedStore): StateContext<T> {
        return NgxsDataAccessor.context.createStateContext(metadata);
    }

    public static ensureMappedState(stateMeta: MetaDataModel): MappedStore {
        if (!NgxsDataAccessor.factory) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
        }

        const cachedMeta: MappedStore = NgxsDataAccessor.statesCachedMeta.get(stateMeta.name) || null;

        if (!cachedMeta) {
            const meta: MappedStore = NgxsDataAccessor.factory.states.find((state) => state.name === stateMeta.name);

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

    public static createPayload(args: IArguments, operation: NgxsDataOperation): PlainObjectOf<Any> {
        const payload: PlainObjectOf<Any> = {};
        const arrayArgs: Array<Any> = Array.from(args);
        operation.argumentsNames.forEach((arg: string, index: number) => {
            payload[arg] = arrayArgs[index];
        });

        return payload;
    }
}
