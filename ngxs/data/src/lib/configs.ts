import { NgxsRepositoryMeta, OperationOptions } from "./symbols";

export const DEFAULT_REPO_META: NgxsRepositoryMeta = {
  stateMeta: null,
  operations: {}
};

export const OPERATION_OPTIONS: OperationOptions = {
  cancelUncompleted: true
};
