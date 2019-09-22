import { ActionOptions, ActionType, StateOperator } from '@ngxs/store';
import { MetaDataModel } from '@ngxs/store/src/internal/internals';
import { Observable } from 'rxjs';

import {
  Any,
  DeepImmutableArray,
  DeepImmutableMap,
  DeepImmutableObject,
  PlainObjectOf,
  Primitive
} from './internal.interface';

export const NGXS_DATA_META: string = 'NGXS_DATA_META';

export interface RepositoryActionOptions extends ActionOptions {
  type?: string;
}

export interface NgxsDataOperation {
  type: string;
  argumentsNames: string[];
  options: ActionOptions;
}

export interface NgxsRepositoryMeta<T = Any> {
  stateMeta?: MetaDataModel;
  operations?: PlainObjectOf<NgxsDataOperation>;
}

export type Immutable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? DeepImmutableArray<U>
  : T extends Map<infer K, infer V>
  ? DeepImmutableMap<K, V>
  : T extends object
  ? DeepImmutableObject<T>
  : unknown;

export interface DataRepository<T> {
  name: string;
  initialState: Immutable<T>;
  state$: Observable<Immutable<T>>;
}

export interface ImmutableStateContext<T, R = T> {
  getState(): Immutable<T>;

  setState(val: T | Immutable<T> | StateOperator<Immutable<T>>): Immutable<R>;

  patchState(val: Partial<T | Immutable<T>>): Immutable<R>;

  dispatch(actions: ActionType | ActionType[]): Observable<void>;
}

export enum NGXS_DATA_EXCEPTIONS {
  NGXS_DATA_MODULE_EXCEPTION = 'Metadata not created \n Maybe you forgot to import the NgxsDataPluginModule' +
    '\n Also, you cannot use this.ctx.* until the application is fully rendered ' +
    '\n (use by default ngxsOnInit(ctx: StateContext), or ngxsAfterBootstrap(ctx: StateContext) !!!',
  NGXS_DATA_STATE_DECORATOR = 'You forgot add decorator @StateRepository or initialize state!' +
    '\n Example: NgxsModule.forRoot([ .. ]), or NgxsModule.forFeature([ .. ])',
  NGXS_DATA_STATIC_ACTION = 'Cannot support static methods with @action',
  NGXS_DATA_ACTION = '@action can only decorate a method implementation'
}
