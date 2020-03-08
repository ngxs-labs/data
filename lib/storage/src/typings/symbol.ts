import { DecodingType, NgxsRepositoryMeta, PersistenceProvider } from '@ngxs-labs/data/typings';

export type ProviderOptions = PersistenceProvider[] | PersistenceProvider;

export interface MergeOptions {
    meta: NgxsRepositoryMeta;
    option: PersistenceProvider;
    prefix: string;
    decodeType: DecodingType;
}
