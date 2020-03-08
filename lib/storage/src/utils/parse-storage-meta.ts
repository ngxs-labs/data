import { StorageMeta } from '@ngxs-labs/data/typings';

import { InvalidStructureDataException } from '../exceptions/invalid-structure-data.exception';

export function parseStorageMeta(value: string | null): StorageMeta | never {
    try {
        return JSON.parse(value!);
    } catch (e) {
        throw new InvalidStructureDataException(e.message);
    }
}
