import { DecodingType, NgxsRepositoryMeta, PersistenceProvider } from '@ngxs-labs/data/typings';

export function createDefault(
    meta: NgxsRepositoryMeta,
    prefix: string,
    decodeType: DecodingType
): PersistenceProvider[] {
    return [
        {
            get path(): string | null | undefined {
                return meta.stateMeta && meta.stateMeta.path;
            },
            existingEngine: localStorage,
            ttl: -1,
            version: 1,
            decode: decodeType,
            prefixKey: prefix,
            nullable: false,
            fireInit: true
        }
    ] as PersistenceProvider[];
}
