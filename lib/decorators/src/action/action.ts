import {
    $args,
    actionNameCreator,
    combineStream,
    NgxsDataFactory,
    NgxsDataInjector,
    validateAction
} from '@ngxs-labs/data/internals';
import { REPOSITORY_ACTION_OPTIONS } from '@ngxs-labs/data/tokens';
import {
    ActionEvent,
    Any,
    DataRepository,
    Descriptor,
    DispatchedResult,
    NgxsDataOperation,
    NgxsRepositoryMeta,
    PlainObjectOf,
    RepositoryActionOptions
} from '@ngxs-labs/data/typings';
import { StateClass } from '@ngxs/store/internals';
import { MappedStore, MetaDataModel } from '@ngxs/store/src/internal/internals';
import { isObservable, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// eslint-disable-next-line max-lines-per-function
export function action(options: RepositoryActionOptions = REPOSITORY_ACTION_OPTIONS): MethodDecorator {
    // eslint-disable-next-line max-lines-per-function
    return (target: Any, name: string | symbol, descriptor: Descriptor): Descriptor => {
        validateAction(target, descriptor);

        const originalMethod: Any = descriptor.value;
        const key: string = name.toString();

        // eslint-disable-next-line max-lines-per-function
        descriptor.value = function(...args: Any[]): DispatchedResult {
            const instance: DataRepository<Any> = (this as Any) as DataRepository<Any>;

            let result: DispatchedResult = null;
            const repository: NgxsRepositoryMeta = NgxsDataFactory.getRepositoryByInstance(instance);
            const operations: PlainObjectOf<NgxsDataOperation> = repository.operations!;
            let operation: NgxsDataOperation = operations[key];
            const stateMeta: MetaDataModel = repository.stateMeta!;

            if (!operation) {
                // Note: late init operation when first invoke action method
                const argumentsNames: string[] = $args(originalMethod);
                const stateName: string = stateMeta.name!;
                const type: string = actionNameCreator(stateName, key, argumentsNames);

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
                return isObservable(result) ? of(null).pipe(map((): Any => result)) : result;
            };

            const payload: PlainObjectOf<Any> = NgxsDataFactory.createPayload(args, operation);
            const event: ActionEvent = { type: operation.type, payload };
            const dispatcher: Observable<Any> = NgxsDataInjector.store!.dispatch(event);

            if (isObservable(result)) {
                return combineStream(dispatcher, result);
            } else {
                return result;
            }
        };

        return descriptor;
    };
}
