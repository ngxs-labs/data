import { Injectable } from '@angular/core';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { Any, NgxsDataOperation, NgxsRepositoryMeta, PlainObjectOf } from '@ngxs-labs/data/typings';
import { StateContext } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import { MappedStore, MetaDataModel } from '@ngxs/store/src/internal/internals';

import { getRepository } from '../utils/get-repository';
import { NgxsDataInjector } from './ngxs-data-injector.service';

@Injectable()
export class NgxsDataFactory {
    private static readonly statesCachedMeta: Map<string, MappedStore> = new Map();

    constructor() {
        NgxsDataFactory.statesCachedMeta.clear();
    }

    public static createStateContext<T>(metadata: MappedStore): StateContext<T> {
        return NgxsDataInjector.context.createStateContext(metadata);
    }

    public static ensureMappedState(stateMeta: MetaDataModel | undefined): MappedStore | null | undefined {
        if (!NgxsDataInjector.factory || !stateMeta) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
        }

        const cachedMeta: MappedStore | null =
            (stateMeta.name ? NgxsDataFactory.statesCachedMeta.get(stateMeta.name) : null) || null;

        if (!cachedMeta) {
            const meta: MappedStore | null | undefined = stateMeta.name
                ? NgxsDataInjector.factory.states.find((state: MappedStore) => state.name === stateMeta.name)
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
