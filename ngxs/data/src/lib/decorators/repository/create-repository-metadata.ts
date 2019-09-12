import { MetaDataModel } from "@ngxs/store/src/internal/internals";
import { Type } from "@angular/core";

import { ensureRepository } from "./ensure-repository";
import { Any, NgxsDataOperation, NgxsRepositoryMeta } from "../../symbols";
import { actionNameCreator } from "../../internals/action-name-creator";
import { clone } from "../../internals/clone";

/**
 * @description need mutate metadata for correct reference
 */
export function createRepositoryMetadata<T>(
  target: Type<Any>,
  stateMeta: MetaDataModel
): void {
  const repositoryMeta: NgxsRepositoryMeta<T> = ensureRepository(target);
  repositoryMeta.stateMeta = stateMeta;

  for (let key of Object.keys(repositoryMeta.operations)) {
    const operation: NgxsDataOperation = repositoryMeta.operations[key];
    operation.type = actionNameCreator(
      stateMeta.name,
      key,
      operation.argumentsNames
    );

    repositoryMeta.stateMeta.actions[operation.type] = [
      { type: operation.type, options: operation.options, fn: operation.type }
    ];
  }
}
