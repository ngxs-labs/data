import { Injectable, Type } from '@angular/core';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import {
    ActionEvent,
    Any,
    DataStateClass,
    MappedState,
    NgxsDataOperation,
    NgxsRepositoryMeta,
    PayloadName,
    PlainObjectOf
} from '@ngxs-labs/data/typings';
import { StateContext } from '@ngxs/store';
import { MappedStore, MetaDataModel } from '@ngxs/store/src/internal/internals';

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
        if (!NgxsDataInjector.factory || !stateMeta) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
        }

        const cachedMeta: MappedStore | null =
            (stateMeta.name ? NgxsDataFactory.statesCachedMeta.get(stateMeta.name) : null) || null;

        if (!cachedMeta) {
            return NgxsDataFactory.ensureMeta(stateMeta);
        }

        return cachedMeta;
    }

    public static getRepositoryByInstance(target: DataStateClass | Any): NgxsRepositoryMeta | never {
        const stateClass: DataStateClass = NgxsDataFactory.getStateClassByInstance(target);
        const repository: NgxsRepositoryMeta | null = getRepository(stateClass) || null;

        if (!repository) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
        }

        return repository;
    }

    public static getStateClassByInstance(target: DataStateClass | Any): DataStateClass {
        return (target || {})['constructor'];
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
            if (registry?.getPayloadTypeByIndex(index)) {
                const payloadName: PayloadName = registry?.getPayloadTypeByIndex(index)!;
                payload[payloadName] = arrayArgs[index];
            }
        }

        return Object.keys(payload).length > 0 ? payload : null;
    }

    public static createAction(operation: NgxsDataOperation, args: Any[], registry?: MethodArgsRegistry): ActionEvent {
        const payload: PlainObjectOf<Any> | null = NgxsDataFactory.createPayload(args, registry);
        const DynamicActionEvent: Type<Any> = dynamicActionByType(operation.type);
        return new DynamicActionEvent(payload) as ActionEvent;
    }

    private static ensureMeta(stateMeta: MetaDataModel): MappedStore | null | undefined {
        const meta: MappedState = stateMeta.name
            ? (NgxsDataInjector.factory.states as MappedStore[])?.find(
                  (state: MappedStore): boolean => state.name === stateMeta.name
              )
            : null;

        if (meta && stateMeta.name) {
            NgxsDataFactory.statesCachedMeta.set(stateMeta.name, meta);
        }

        return meta;
    }
}
