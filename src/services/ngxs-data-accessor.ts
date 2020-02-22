import { Inject, Injectable, Injector, NgZone } from '@angular/core';
import { Any, PlainObjectOf } from '@ngxs-labs/data/internals';
import { StateContext, Store } from '@ngxs/store';
import { NGXS_STATE_CONTEXT_FACTORY, NGXS_STATE_FACTORY, StateClass } from '@ngxs/store/internals';
import { MappedStore, MetaDataModel } from '@ngxs/store/src/internal/internals';

import { NgxsDataOperation, NgxsRepositoryMeta } from '../interfaces/external.interface';
import { NGXS_DATA_EXCEPTIONS } from '../interfaces/internal.interface';
import { getRepository } from '../utils/internals/ensure-repository';

/**
 * @privateApi
 */
@Injectable()
export class NgxsDataAccessor {
    public static store: Store | null = null;
    public static context: Any | null = null;
    public static factory: Any | null = null;
    public static ngZone: NgZone | null = null;
    private static readonly statesCachedMeta: Map<string, MappedStore> = new Map();

    constructor(
        injector: Injector,
        @Inject(NGXS_STATE_FACTORY) stateFactory: Any,
        @Inject(NGXS_STATE_CONTEXT_FACTORY) stateContextFactory: Any
    ) {
        NgxsDataAccessor.statesCachedMeta.clear();
        NgxsDataAccessor.store = injector.get<Store>(Store);
        NgxsDataAccessor.ngZone = injector.get<NgZone>(NgZone);
        NgxsDataAccessor.factory = stateFactory;
        NgxsDataAccessor.context = stateContextFactory;
    }

    public static createStateContext<T>(metadata: MappedStore): StateContext<T> {
        return NgxsDataAccessor.context.createStateContext(metadata);
    }

    public static ensureMappedState(stateMeta: MetaDataModel | undefined): MappedStore | null | undefined {
        if (!NgxsDataAccessor.factory || !stateMeta) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
        }

        const cachedMeta: MappedStore | null =
            (stateMeta.name ? NgxsDataAccessor.statesCachedMeta.get(stateMeta.name) : null) || null;

        if (!cachedMeta) {
            const meta: MappedStore | null | undefined = stateMeta.name
                ? NgxsDataAccessor.factory.states.find((state: MappedStore) => state.name === stateMeta.name)
                : null;

            if (meta && stateMeta.name) {
                NgxsDataAccessor.statesCachedMeta.set(stateMeta.name, meta);
            }

            return meta;
        }

        return cachedMeta;
    }

    public static getRepositoryByInstance(target: StateClass | Any): NgxsRepositoryMeta {
        const repository: NgxsRepositoryMeta | null = getRepository((target || {})['constructor']) || null;

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
