import { StateClass } from '@ngxs/store/internals';

import { NgxsRepositoryMeta } from '../common/repository';
import { DecodingType, PersistenceProvider } from '../common/storage';

export type ProviderOptions = PersistenceProvider[] | PersistenceProvider;

export interface MergeOptions {
    meta: NgxsRepositoryMeta;
    option: PersistenceProvider;
    prefix: string;
    decodeType: DecodingType;
    stateInstance: StateClass;
}
