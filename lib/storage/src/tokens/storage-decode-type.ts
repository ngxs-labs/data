import { Provider } from '@angular/core';
import { DecodingType } from '@ngxs-labs/data/typings';

import { NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN } from './storage-decode-type-token';

export const DEFAULT_DECODE_TYPE: DecodingType = 'none';

export const NGXS_DATA_STORAGE_DECODE_TYPE: Provider = {
    provide: NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN,
    useValue: DEFAULT_DECODE_TYPE
};
