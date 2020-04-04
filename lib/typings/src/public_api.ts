export {
    RepositoryActionOptions,
    ActionEvent,
    ActionName,
    PayloadMap,
    PayloadName,
    ArgName,
    ArgNameMap
} from './types/actions-properties';
export { Immutable, Mutable } from './types/immutability';
export {
    NgxsRepositoryMeta,
    ImmutableStateValue,
    NgxsDataOperation,
    ImmutableStateContext,
    ImmutableDataRepository,
    ImmutablePatchValue,
    StateValue,
    PatchValue,
    DataRepository,
    DataStateContext
} from './types/repository';
export {
    StorageMeta,
    DataStorage,
    DecodingType,
    StorageContainer,
    PersistenceProvider,
    ExistingStorageEngine,
    ExistingEngineProvider,
    UseClassEngineProvider,
    RootInternalStorageEngine
} from './types/storage';
export { Any } from './types/any';
export { PlainObjectOf } from './types/plaing-object-of';
export { ClassType } from './types/class';
export { MappedState } from './types/mapped-state';
export { NgxsDataExtension } from './types/extension';
export { Descriptor } from './types/descriptor';
export { DispatchedResult } from './types/dispatched-result';
export { DataStateClass, StateClassDecorator, StateArgumentDecorator } from './types/data-state-class';
export { ComputedOptions } from './types/computed-options';
export { ComputedCacheMap } from './types/computed-cache-map';
