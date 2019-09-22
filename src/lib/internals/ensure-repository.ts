import { NGXS_DATA_META, NgxsRepositoryMeta } from '../interfaces/external.interface';

/**
 * @description
 * don't use !target.hasOwnProperty(NGXS_DATA_META),
 * because you need support access from parent inheritance class
 */
export function ensureRepository<T>(target: Function): NgxsRepositoryMeta<T> {
  if (!target[NGXS_DATA_META]) {
    Object.defineProperty(target, NGXS_DATA_META, {
      value: {
        stateMeta: null,
        operations: {}
      }
    });
  }

  return getRepository(target);
}

export function getRepository<T>(target: Function): NgxsRepositoryMeta<T> {
  return target[NGXS_DATA_META];
}
