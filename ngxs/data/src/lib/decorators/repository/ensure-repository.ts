import { Type } from "@angular/core";

import { Any, NGXS_DATA_META, NgxsRepositoryMeta } from "../../symbols";
import { DEFAULT_REPO_META } from "../../configs";

export function ensureRepository<T>(target: Type<Any>): NgxsRepositoryMeta<T> {
  if (!target.hasOwnProperty(NGXS_DATA_META)) {
    Object.defineProperty(target, NGXS_DATA_META, { value: DEFAULT_REPO_META });
  }

  return getRepository(target);
}

export function getRepository<T>(target: Type<Any>): NgxsRepositoryMeta<T> {
  return target[NGXS_DATA_META];
}
