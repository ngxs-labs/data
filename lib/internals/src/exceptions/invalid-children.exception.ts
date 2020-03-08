import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { Any } from '@ngxs-labs/data/typings';

export class InvalidChildrenException extends Error {
    constructor(currentDefaults: Any) {
        super(
            `${NGXS_DATA_EXCEPTIONS.NGXS_DATA_CHILDREN_CONVERT}. Cannot convert ${
                currentDefaults && currentDefaults.constructor ? currentDefaults.constructor.name : currentDefaults
            } to PlainObject`
        );
    }
}
