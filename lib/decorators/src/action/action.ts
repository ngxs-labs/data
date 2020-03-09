/* eslint-disable */
import { $args, actionNameCreator, NgxsDataFactory, NgxsDataInjector, validateAction } from '@ngxs-labs/data/internals';
import { NGXS_DATA_EXCEPTIONS, REPOSITORY_ACTION_OPTIONS } from '@ngxs-labs/data/tokens';
import {
    ActionEvent,
    Any,
    DataRepository,
    NgxsDataOperation,
    NgxsRepositoryMeta,
    PlainObjectOf,
    RepositoryActionOptions
} from '@ngxs-labs/data/typings';
import { StateClass } from '@ngxs/store/internals';
import { MappedStore, MetaDataModel } from '@ngxs/store/src/internal/internals';
import { forkJoin, isObservable, Observable, of, Subject } from 'rxjs';
import { debounceTime, finalize, map, take } from 'rxjs/operators';

export function action(options: RepositoryActionOptions = REPOSITORY_ACTION_OPTIONS): MethodDecorator {
    return (target: Any, name: string | symbol, descriptor: TypedPropertyDescriptor<Any>): void => {
        validateAction(target, descriptor);

        const originalMethod: Any = descriptor.value;
        const key: string = name.toString();
        let scheduleId: number | null | Any = null;
        let scheduleTask: Subject<Any> | null = null;

        descriptor.value = function() {
            const instance: DataRepository<Any> = (this as Any) as DataRepository<Any>;

            let result: Any | Observable<Any>;
            const args: IArguments = arguments;
            const repository: NgxsRepositoryMeta = NgxsDataFactory.getRepositoryByInstance(instance);
            const operations: PlainObjectOf<NgxsDataOperation> = repository.operations!;
            let operation: NgxsDataOperation = operations![key];
            const stateMeta: MetaDataModel = repository.stateMeta!;

            if (!operation) {
                // Note: late init operation when first invoke action method
                const argumentsNames: string[] = $args(originalMethod);
                const stateName: string = stateMeta.name!;
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

            const mapped: MappedStore = NgxsDataFactory.ensureMappedState(stateMeta)!;
            const stateInstance: StateClass = mapped.instance;

            // Note: invoke only after store.dispatch(...)
            (stateInstance as Any)[operation.type] = (): Any => {
                result = originalMethod.apply(instance, args);
                // Note: store.dispatch automatically subscribes, but we don’t need it
                // We want to subscribe ourselves manually
                return isObservable(result) ? of(null).pipe(map(() => result)) : result;
            };

            const payload: PlainObjectOf<Any> = NgxsDataFactory.createPayload(arguments, operation);
            const event: ActionEvent = { type: operation.type, payload };

            if (options.async) {
                if (scheduleTask) {
                    scheduleTask.complete();
                }

                const resultStream: Subject<Any> = (scheduleTask = new Subject<Any>());
                const source: Observable<Any> = resultStream.asObservable().pipe(take(1));
                const debounce: number = options.debounce || 0;

                const throttleTask: Promise<Any> = new Promise((resolve) => {
                    NgxsDataInjector.ngZone!.runOutsideAngular(() => {
                        clearTimeout(scheduleId!);
                        scheduleId = setTimeout(() => resolve(), options.debounce);
                    });
                });

                throttleTask.then(() => {
                    const dispatched: Observable<Any> = NgxsDataInjector.store!.dispatch(event);

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
                });

                return source.pipe(
                    debounceTime(debounce),
                    finalize((): void => {
                        scheduleTask && scheduleTask.complete();
                    })
                );
            } else {
                const dispatcher: Observable<Any> = NgxsDataInjector.store!.dispatch(event);

                if (isObservable(result)) {
                    return combine(dispatcher, result);
                } else {
                    return result;
                }
            }
        };
    };
}

function combine(dispatched: Observable<Any>, result: Observable<Any>): Observable<Any> {
    return forkJoin([dispatched, result]).pipe(map((combines: [Any, Any]) => combines.pop()));
}
