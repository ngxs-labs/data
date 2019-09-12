import { forkJoin, isObservable, Observable } from "rxjs";
import { Type } from "@angular/core";
import { map } from "rxjs/operators";

import { getStateFromFactory } from "../../internals/get-state-from-factory";
import {
  Any,
  NgxsDataOperation,
  NgxsRepositoryMeta,
  OperationOptions,
  PlainObjectOf
} from "../../symbols";
import { ensureRepository } from "../repository/ensure-repository";
import { NgxsDataPluginModule } from "../../ngxs-data.module";
import { $args } from "../../internals/args-parser";
import { OPERATION_OPTIONS } from "../../configs";

export function action(
  options: OperationOptions = OPERATION_OPTIONS
): MethodDecorator {
  return (
    target: any,
    name: string | symbol,
    descriptor: TypedPropertyDescriptor<Any>
  ): void => {
    const isStaticMethod = target.hasOwnProperty("prototype");

    if (isStaticMethod) {
      throw new Error("Cannot support static methods with @Operation");
    }

    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(target, name);
    }

    const originalMethod: Any = descriptor.value;
    const key: string = name.toString();
    const repository: NgxsRepositoryMeta = ensureRepository(target.constructor);

    descriptor.value = function() {
      let result: Any = undefined;
      const args: IArguments = arguments;
      const operation: NgxsDataOperation = repository.operations[key];
      const state: Type<unknown> = getStateFromFactory(repository.stateMeta)
        .instance;

      state[operation.type] = () => {
        result = originalMethod.apply(this, args);
        return result;
      };

      const payload: PlainObjectOf<Any> = {};
      operation.argumentsNames.forEach((arg: string, index: number) => {
        payload[arg] = Array.from(args)[index];
      });

      const dispatched: Observable<any> = NgxsDataPluginModule.store.dispatch({
        type: repository.operations[key].type,
        payload: payload
      });

      if (isObservable(result)) {
        return forkJoin([dispatched, result]).pipe(
          map((combines: [Any, Any]) => combines[1])
        );
      } else {
        return result;
      }
    };

    repository.operations[key] = {
      type: null,
      options: options,
      methodFn: originalMethod,
      argumentsNames: $args(originalMethod)
    };
  };
}
