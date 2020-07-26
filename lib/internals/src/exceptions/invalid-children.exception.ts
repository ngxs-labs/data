import { Any } from '@angular-ru/common/typings';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';

export class InvalidChildrenException extends Error {
    constructor(currentDefaults: Any) {
        super(
            `${NGXS_DATA_EXCEPTIONS.NGXS_DATA_CHILDREN_CONVERT}. Cannot convert ${
                currentDefaults && currentDefaults.constructor ? currentDefaults.constructor.name : currentDefaults
            } to PlainObject`
        );
    }
}
