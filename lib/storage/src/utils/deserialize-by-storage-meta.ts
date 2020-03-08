import { isPlainObject } from '@ngxs-labs/data/internals';
import { Any, StorageMeta } from '@ngxs-labs/data/typings';

import { InvalidDataValueException } from '../exceptions/invalid-data-value.exception';
import { InvalidLastChangedException } from '../exceptions/invalid-last-changed.exception';
import { InvalidStructureDataException } from '../exceptions/invalid-structure-data.exception';
import { InvalidVersionException } from '../exceptions/invalid-version.exception';

export function deserializeByStorageMeta(meta: StorageMeta, value: string | null): string | never {
    if (isPlainObject(meta)) {
        if (missingLastChanged(meta)) {
            throw new InvalidLastChangedException(value);
        } else if (versionIsInvalid(meta)) {
            throw new InvalidVersionException(meta.version);
        } else if (missingDataKey(meta)) {
            throw new InvalidDataValueException();
        }

        return meta.data;
    } else {
        throw new InvalidStructureDataException(`"${value}" not an object`);
    }
}

function versionIsInvalid(meta: StorageMeta): boolean {
    const version: number = parseFloat(meta.version as Any);
    return isNaN(version) || version < 1 || parseInt(meta.version as Any) !== version;
}

function missingDataKey(meta: StorageMeta): boolean {
    return !('data' in meta);
}

function missingLastChanged(meta: StorageMeta): boolean {
    return !('lastChanged' in meta) || !meta.lastChanged;
}
