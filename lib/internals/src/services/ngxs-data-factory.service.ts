import { Injectable, Type } from '@angular/core';
import { Any, PlainObjectOf } from '@angular-ru/common/typings';
import { isNil, isNotNil } from '@angular-ru/common/utils';
import { StateContext } from '@ngxs/store';
import { MappedStore, MetaDataModel } from '@ngxs/store/src/internal/internals';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import {
    ActionEvent,
    DataStateClass,
    MappedState,
    NgxsDataOperation,
    NgxsRepositoryMeta,
    PayloadName
} from '@ngxs-labs/data/typings';

import { dynamicActionByType } from '../utils/action/dynamic-action';
import { MethodArgsRegistry } from '../utils/method-args-registry/method-args-registry';
import { getRepository } from '../utils/repository/get-repository';
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

    public static ensureMappedState(stateMeta: MetaDataModel | undefined): MappedState | never {
        if (isNil(NgxsDataInjector.factory) || isNil(stateMeta)) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
        }

        const cachedMeta: MappedStore | null =
            (isNotNil(stateMeta.name) ? NgxsDataFactory.statesCachedMeta.get(stateMeta.name) : null) || null;

        if (!cachedMeta) {
            return NgxsDataFactory.ensureMeta(stateMeta);
        }

        return cachedMeta;
    }

    public static getRepositoryByInstance(target: DataStateClass | Any): NgxsRepositoryMeta | never {
        const stateClass: DataStateClass = NgxsDataFactory.getStateClassByInstance(target);
        const repository: NgxsRepositoryMeta | null = getRepository(stateClass) ?? null;

        if (isNil(repository)) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
        }

        return repository;
    }

    public static getStateClassByInstance(target: DataStateClass | Any): DataStateClass {
        return (target ?? {})['constructor'];
    }

    public static clearMetaByInstance(target: DataStateClass | Any): void {
        const repository: NgxsRepositoryMeta = NgxsDataFactory.getRepositoryByInstance(target);
        repository.stateMeta!.actions = {};
        repository.operations = {};
    }

    public static createPayload(args: Any[], registry?: MethodArgsRegistry): PlainObjectOf<Any> | null {
        const payload: PlainObjectOf<Any> = {};
        const arrayArgs: Any[] = Array.from(args);

        for (let index: number = 0; index < arrayArgs.length; index++) {
            const payloadName: PayloadName | null | undefined = registry?.getPayloadTypeByIndex(index);
            if (isNotNil(payloadName)) {
                payload[payloadName] = arrayArgs[index];
            }
        }

        return Object.keys(payload).length > 0 ? payload : null;
    }

    public static createAction(operation: NgxsDataOperation, args: Any[], registry?: MethodArgsRegistry): ActionEvent {
        const payload: PlainObjectOf<Any> | null = NgxsDataFactory.createPayload(args, registry);
        const dynamicActionByTypeFactory: Type<Any> = dynamicActionByType(operation.type);
        return new dynamicActionByTypeFactory(payload) as ActionEvent;
    }

    private static ensureMeta(stateMeta: MetaDataModel): MappedStore | null | undefined {
        const meta: MappedState = isNotNil(stateMeta.name)
            ? (NgxsDataInjector.factory.states as MappedStore[])?.find(
                  (state: MappedStore): boolean => state.name === stateMeta.name
              )
            : null;

        if (isNotNil(meta) && isNotNil(stateMeta.name)) {
            NgxsDataFactory.statesCachedMeta.set(stateMeta.name, meta);
        }

        return meta;
    }
}
