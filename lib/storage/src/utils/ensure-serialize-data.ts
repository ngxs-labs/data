import { isNotNil } from '@ngxs-labs/data/internals';
import { PersistenceProvider, STORAGE_DECODE_TYPE, StorageData } from '@ngxs-labs/data/typings';

export function ensureSerializeData<T>(data: T | null, provider: PersistenceProvider): StorageData<T> {
    const dataLocal: T | null = isNotNil(data) ? data : null;
    return provider.decode === STORAGE_DECODE_TYPE.BASE64 ? btoa(JSON.stringify(dataLocal)) : dataLocal;
}
