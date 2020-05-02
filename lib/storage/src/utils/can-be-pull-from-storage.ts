import { isNotNil } from '@ngxs-labs/data/internals';
import { PullFromStorageInfo, PullFromStorageOptions } from '@ngxs-labs/data/typings';

import { existTtl } from './exist-ttl';
import { isExpiredByTtl } from './is-expired';

export function canBePullFromStorage<T>(options: PullFromStorageOptions<T>): PullFromStorageInfo {
    const { meta, data, provider }: PullFromStorageOptions<T> = options;
    const canBeOverrideFromStorage: boolean = isNotNil(data) || provider.nullable!;
    let result: PullFromStorageInfo = { canBeOverrideFromStorage, expired: false, expiry: null };

    if (canBeOverrideFromStorage && existTtl(provider)) {
        const expiry: Date = new Date(meta.expiry!);
        const expiryExist: boolean = !isNaN(expiry.getTime());

        if (expiryExist) {
            if (isExpiredByTtl(expiry)) {
                result = { canBeOverrideFromStorage: false, expired: true, expiry };
            } else {
                result = { canBeOverrideFromStorage, expired: false, expiry };
            }
        }
    }

    return result;
}
