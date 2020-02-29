import { Inject, Injectable, Injector, NgZone } from '@angular/core';
import { getRepository } from '@ngxs-labs/data/internals';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { Any, NgxsDataOperation, NgxsRepositoryMeta, PlainObjectOf } from '@ngxs-labs/data/typings';
import { StateContext, Store } from '@ngxs/store';
import { NGXS_STATE_CONTEXT_FACTORY, NGXS_STATE_FACTORY, StateClass } from '@ngxs/store/internals';
import { MappedStore, MetaDataModel } from '@ngxs/store/src/internal/internals';

@Injectable()
export class NgxsDataFactory {
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
        NgxsDataFactory.statesCachedMeta.clear();
        NgxsDataFactory.store = injector.get<Store>(Store);
        NgxsDataFactory.ngZone = injector.get<NgZone>(NgZone);
        NgxsDataFactory.factory = stateFactory;
        NgxsDataFactory.context = stateContextFactory;
    }

    public static createStateContext<T>(metadata: MappedStore): StateContext<T> {
        return NgxsDataFactory.context.createStateContext(metadata);
    }

    public static ensureMappedState(stateMeta: MetaDataModel | undefined): MappedStore | null | undefined {
        if (!NgxsDataFactory.factory || !stateMeta) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
        }

        const cachedMeta: MappedStore | null =
            (stateMeta.name ? NgxsDataFactory.statesCachedMeta.get(stateMeta.name) : null) || null;

        if (!cachedMeta) {
            const meta: MappedStore | null | undefined = stateMeta.name
                ? NgxsDataFactory.factory.states.find((state: MappedStore) => state.name === stateMeta.name)
                : null;

            if (meta && stateMeta.name) {
                NgxsDataFactory.statesCachedMeta.set(stateMeta.name, meta);
            }

            return meta;
        }

        return cachedMeta;
    }

    public static getRepositoryByInstance(target: StateClass | Any): NgxsRepositoryMeta {
        const stateClass: StateClass = (target || {})['constructor'];
        const repository: NgxsRepositoryMeta | null = getRepository(stateClass) || null;

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
