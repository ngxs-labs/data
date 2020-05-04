import { InjectionToken } from '@angular/core';
import { STORAGE_DECODE_TYPE } from '@ngxs-labs/data/typings';

export const NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN: InjectionToken<STORAGE_DECODE_TYPE> = new InjectionToken(
    'NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN'
);
