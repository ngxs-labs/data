import { isPlainObject } from '@ngxs-labs/data/internals';
import { Any, PersistenceProvider, STORAGE_DECODE_TYPE, StorageData, StorageMeta } from '@ngxs-labs/data/typings';

import { InvalidDataValueException } from '../exceptions/invalid-data-value.exception';
import { InvalidLastChangedException } from '../exceptions/invalid-last-changed.exception';
import { InvalidStructureDataException } from '../exceptions/invalid-structure-data.exception';
import { InvalidVersionException } from '../exceptions/invalid-version.exception';

export function deserializeByStorageMeta<T>(
    meta: StorageMeta<T>,
    value: string | null,
    provider: PersistenceProvider
): StorageData<T> | never {
    if (isPlainObject(meta)) {
        if (missingLastChanged(meta)) {
            throw new InvalidLastChangedException(value);
        } else if (versionIsInvalid(meta)) {
            throw new InvalidVersionException(meta.version);
        } else if (missingDataKey(meta)) {
            throw new InvalidDataValueException();
        }

        return provider.decode === STORAGE_DECODE_TYPE.BASE64
            ? JSON.parse(window.atob(meta.data as string))
            : meta.data;
    } else {
        throw new InvalidStructureDataException(`"${value}" not an object`);
    }
}

function versionIsInvalid<T>(meta: StorageMeta<T>): boolean {
    const version: number = parseFloat(meta.version as Any);
    return isNaN(version) || version < 1 || parseInt(meta.version as Any) !== version;
}

function missingDataKey<T>(meta: StorageMeta<T>): boolean {
    return !('data' in meta);
}

function missingLastChanged<T>(meta: StorageMeta<T>): boolean {
    return !('lastChanged' in meta) || !meta.lastChanged;
}
