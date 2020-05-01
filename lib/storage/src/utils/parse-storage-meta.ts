import { StorageMeta } from '@ngxs-labs/data/typings';

import { InvalidStructureDataException } from '../exceptions/invalid-structure-data.exception';

export function parseStorageMeta<T>(value: string | null): StorageMeta<T> | never {
    try {
        return JSON.parse(value!);
    } catch (e) {
        throw new InvalidStructureDataException(e.message);
    }
}
