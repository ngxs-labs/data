import { MappedStore } from '@ngxs/store/src/internal/internals';
import { forkJoin, isObservable, Observable, Subject } from 'rxjs';
import { debounceTime, finalize, first, map } from 'rxjs/operators';
import { Type } from '@angular/core';

import {
    NGXS_DATA_EXCEPTIONS,
    NgxsDataOperation,
    NgxsRepositoryMeta,
    RepositoryActionOptions
} from '../../interfaces/external.interface';
import { $args } from '../../internals/args-parser';
import { REPOSITORY_ACTION_OPTIONS } from './action.config';
import { actionNameCreator } from '../../internals/action-name-creator';
import { NgxsDataAccessor } from '../../services/data-access-injector.service';
import { ActionEvent, Any, PlainObjectOf } from '../../interfaces/internal.interface';
import { NgxsDataRepository } from '../../impl/ngxs-data.repository';

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
        let scheduleId: number = null;
        let scheduleTask: Subject<Any> = null;

        descriptor.value = function() {
            const instance: NgxsDataRepository<Any> = this;

            let result: Any = undefined;
            const args: IArguments = arguments;
            const repository: NgxsRepositoryMeta = NgxsDataAccessor.getRepositoryByInstance(instance);
            let operation: NgxsDataOperation = repository.operations[key] || null;

            if (!operation) {
                const argumentsNames: string[] = $args(originalMethod);
                operation = repository.operations[key] = {
                    argumentsNames,
                    type: options.type || actionNameCreator(repository.stateMeta.name, key, argumentsNames),
                    options: { cancelUncompleted: options.cancelUncompleted }
                };

                repository.stateMeta.actions[operation.type] = [
                    { type: operation.type, options: operation.options, fn: operation.type }
                ];
            }

            const mapped: MappedStore = NgxsDataAccessor.ensureMappedState(repository.stateMeta);
            const stateInstance: Type<unknown> = mapped.instance;

            stateInstance[operation.type] = (): Any => {
                result = originalMethod.apply(instance, args);
                return result;
            };

            const payload: PlainObjectOf<Any> = NgxsDataAccessor.createPayload(arguments, operation);
            const event: ActionEvent = { type: operation.type, payload };

            if (options.async) {
                if (scheduleTask) {
                    scheduleTask.complete();
                }

                const resultStream: Subject<Any> = (scheduleTask = new Subject<Any>());
                const source: Observable<Any> = resultStream.asObservable().pipe(first());

                const throttleTask: Promise<Any> = new Promise((resolve) => {
                    NgxsDataAccessor.ngZone.runOutsideAngular(() => {
                        window.clearTimeout(scheduleId);
                        scheduleId = window.setTimeout(() => resolve(), options.debounce);
                    });
                });

                throttleTask.then(() => {
                    const dispatched: Observable<Any> = NgxsDataAccessor.store.dispatch(event);

                    if (isObservable(result)) {
                        combine(dispatched, result)
                            .pipe(first())
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
                });

                return source.pipe(
                    debounceTime(options.debounce),
                    finalize(() => scheduleTask && scheduleTask.complete())
                );
            } else {
                const dispatched: Observable<Any> = NgxsDataAccessor.store.dispatch(event);
                return isObservable(result) ? combine(dispatched, result) : result;
            }
        };
    };
}

function combine(dispatched: Observable<Any>, result: Any): Observable<Any> {
    return forkJoin([dispatched, result]).pipe(map((combines: [Any, Any]) => combines.pop()));
}
