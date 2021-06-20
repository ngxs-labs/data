import { isNil } from '@angular-ru/common/utils';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';

import { NgxsDataInjector } from '../../services/ngxs-data-injector.service';

export function checkExistNgZone(): void | never {
    if (isNil(NgxsDataInjector.ngZone)) {
        throw new Error(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
    }
}
