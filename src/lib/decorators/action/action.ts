import { MappedStore, MetaDataModel } from '@ngxs/store/src/internal/internals';
import { forkJoin, isObservable, Observable, Subject } from 'rxjs';
import { debounceTime, finalize, map, take } from 'rxjs/operators';
import { StateClass } from '@ngxs/store/internals';
import { NgZone } from '@angular/core';
import { Store } from '@ngxs/store';

import {
    NGXS_DATA_EXCEPTIONS,
    NgxsDataOperation,
    NgxsRepositoryMeta,
    RepositoryActionOptions
} from '../../interfaces/external.interface';
import { $args } from '../../internals/args-parser';
import { REPOSITORY_ACTION_OPTIONS } from './action.config';
import { actionNameCreator } from '../../internals/action-name-creator';
import { ActionEvent, Any, PlainObjectOf } from '../../interfaces/internal.interface';
import { NgxsDataRepository } from '../../impl/ngxs-data.repository';
import { NgxsDataAccessor } from '../../services/ngxs-data-accessor';

export function action(options: RepositoryActionOptions = REPOSITORY_ACTION_OPTIONS): MethodDecorator {
    return (target: Any, name: string | symbol, descriptor: TypedPropertyDescriptor<Any>): void => {
        const isStaticMethod = target.hasOwnProperty('prototype');

        if (isStaticMethod) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATIC_ACTION);
        }

        if (descriptor === undefined) {
            throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_ACTION);
        }

        const originalMethod: Any = descriptor.value;
        const key: string = name.toString();
        let scheduleId: number | null = null;
        let scheduleTask: Subject<Any> | null = null;

        descriptor.value = function() {
            const instance: NgxsDataRepository<Any> = (this as Any) as NgxsDataRepository<Any>;

            let result: Any | Observable<Any> = undefined;
            const args: IArguments = arguments;
            const repository: NgxsRepositoryMeta = NgxsDataAccessor.getRepositoryByInstance(instance);
            const operations: PlainObjectOf<NgxsDataOperation> | null = (repository && repository.operations) || null;
            let operation: NgxsDataOperation | null = (operations ? operations[key] : null) || null;
            const stateMeta: MetaDataModel | null = repository.stateMeta || null;

            if (!stateMeta || !operations) {
                throw new Error('Not found meta information into state repository');
            }

            if (!operation) {
                // Note: late init operation when first invoke action method
                const argumentsNames: string[] = $args(originalMethod);
                const stateName: string | null = stateMeta.name || null;
                const type: string = options.type || actionNameCreator(stateName, key, argumentsNames);

                operation = operations[key] = {
                    type,
                    argumentsNames,
                    options: { cancelUncompleted: options.cancelUncompleted }
                };

                stateMeta.actions[operation.type] = [
                    { type: operation.type, options: operation.options, fn: operation.type }
                ];
            }

            const mapped: MappedStore | null | undefined = NgxsDataAccessor.ensureMappedState(stateMeta);

            if (!mapped) {
                throw new Error('Cannot ensure mapped state from state repository');
            }

            const stateInstance: StateClass = mapped.instance;

            (stateInstance as Any)[operation.type] = (): Any => {
                result = originalMethod.apply(instance, args);
                return result;
            };

            const payload: PlainObjectOf<Any> = NgxsDataAccessor.createPayload(arguments, operation);
            const event: ActionEvent = { type: operation.type, payload };
            const store: Store | null = NgxsDataAccessor.store;

            if (options.async) {
                if (scheduleTask) {
                    scheduleTask.complete();
                }

                const resultStream: Subject<Any> = (scheduleTask = new Subject<Any>());
                const source: Observable<Any> = resultStream.asObservable().pipe(take(1));
                const debounce: number = options.debounce || 0;

                const throttleTask: Promise<Any> = new Promise((resolve) => {
                    const ngZone: NgZone | null = NgxsDataAccessor.ngZone;
                    if (ngZone) {
                        ngZone.runOutsideAngular(() => {
                            if (scheduleId) {
                                clearTimeout(scheduleId as Any);
                            }

                            scheduleId = (setTimeout(() => resolve(), debounce) as Any) as number;
                        });
                    }
                });

                throttleTask.then(() => {
                    if (store) {
                        const dispatched: Observable<Any> = store.dispatch(event);

                        if (isObservable(result)) {
                            combine(dispatched, result)
                                .pipe(take(1))
                                .subscribe((val: Any) => {
                                    resultStream.next(val);
                                    resultStream.complete();
                                });
                        } else {
                            if (typeof result !== 'undefined') {
                                console.warn(NGXS_DATA_EXCEPTIONS.NGXS_DATA_ACTION_RETURN_TYPE, typeof result);
                            }

                            resultStream.next(result);
                            resultStream.complete();
                        }
                    }
                });

                return source.pipe(
                    debounceTime(debounce),
                    finalize(() => scheduleTask && scheduleTask.complete())
                );
            } else {
                const dispatched: Observable<Any> | null = (store && store.dispatch(event)) || null;
                return dispatched && isObservable(result) ? combine(dispatched, result) : result;
            }
        };
    };
}

function combine(dispatched: Observable<Any>, result: Observable<Any>): Observable<Any> {
    return forkJoin([dispatched, result]).pipe(map((combines: [Any, Any]) => combines.pop()));
}
