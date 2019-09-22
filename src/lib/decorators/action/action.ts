import { MappedStore } from '@ngxs/store/src/internal/internals';
import { forkJoin, isObservable, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

export function action(
  options: RepositoryActionOptions = REPOSITORY_ACTION_OPTIONS
): MethodDecorator {
  return (
    target: Any,
    name: string | symbol,
    descriptor: TypedPropertyDescriptor<Any>
  ): void => {
    const isStaticMethod = target.hasOwnProperty('prototype');

    if (isStaticMethod) {
      throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATIC_ACTION);
    }

    if (descriptor === undefined) {
      throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_ACTION);
    }

    const originalMethod: Any = descriptor.value;
    const key: string = name.toString();

    descriptor.value = function() {
      let result: Any = undefined;
      const args: IArguments = arguments;
      const repository: NgxsRepositoryMeta = NgxsDataAccessor.getRepositoryByInstance(this);
      let operation: NgxsDataOperation = repository.operations[key] || null;

      if (!operation) {
        const argumentsNames: string[] = $args(originalMethod);
        operation = repository.operations[key] = {
          argumentsNames,
          type:
            options.type || actionNameCreator(repository.stateMeta.name, key, argumentsNames),
          options: { cancelUncompleted: options.cancelUncompleted }
        };

        repository.stateMeta.actions[operation.type] = [
          { type: operation.type, options: operation.options, fn: operation.type }
        ];
      }

      const mapped: MappedStore = NgxsDataAccessor.ensureMappedState(repository.stateMeta);
      const stateInstance: Type<unknown> = mapped.instance;

      stateInstance[operation.type] = (): Any => {
        result = originalMethod.apply(this, args);
        return result;
      };

      const payload: PlainObjectOf<Any> = NgxsDataAccessor.createPayload(arguments, operation);
      const event: ActionEvent = { type: operation.type, payload };
      const dispatched: Observable<Any> = NgxsDataAccessor.store.dispatch(event);

      return isObservable(result)
        ? forkJoin([dispatched, result]).pipe(map((combines: [Any, Any]) => combines.pop()))
        : result;
    };
  };
}
