import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';

export class NotDeclareEngineException extends Error {
    constructor(key: string) {
        super(`${NGXS_DATA_EXCEPTIONS.NGXS_PERSISTENCE_ENGINE} \nMetadata { key: '${key}' }`);
    }
}
