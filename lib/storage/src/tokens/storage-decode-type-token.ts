import { InjectionToken } from '@angular/core';
import { DecodingType } from '@ngxs-labs/data/typings';

export const NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN: InjectionToken<DecodingType> = new InjectionToken(
    'NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN'
);
