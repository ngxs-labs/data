import { Any } from '@angular-ru/common/typings';
import { isNotNil } from '@ngxs-labs/data/internals';
import { NgxsDataMigrateStorage, PullFromStorageInfo, PullFromStorageOptions } from '@ngxs-labs/data/typings';

import { existTtl } from './exist-ttl';
import { isExpiredByTtl } from './is-expired';

export function canBePullFromStorage<T>(options: PullFromStorageOptions<T>): PullFromStorageInfo {
    const { data, provider }: PullFromStorageOptions<T> = options;
    const canBeOverrideFromStorage: boolean = isNotNil(data) || provider.nullable!;

    let result: PullFromStorageInfo = {
        canBeOverrideFromStorage,
        versionMismatch: false,
        expired: false,
        expiry: null
    };

    result = ensureInfoByTtl(canBeOverrideFromStorage, result, options);
    result = ensureInfoByVersionMismatch(canBeOverrideFromStorage, result, options);

    return result;
}

function ensureInfoByTtl<T>(
    canBeOverrideFromStorage: boolean,
    result: PullFromStorageInfo,
    options: PullFromStorageOptions<T>
): PullFromStorageInfo {
    const { meta, provider }: PullFromStorageOptions<T> = options;

    if (canBeOverrideFromStorage && existTtl(provider)) {
        const expiry: Date = new Date(meta.expiry!);
        const expiryExist: boolean = !isNaN(expiry.getTime());

        if (expiryExist) {
            if (isExpiredByTtl(expiry)) {
                result = { canBeOverrideFromStorage: false, expired: true, expiry, versionMismatch: false };
            } else {
                result = { canBeOverrideFromStorage, expired: false, expiry, versionMismatch: false };
            }
        }
    }

    return result;
}

function ensureInfoByVersionMismatch<T>(
    canBeOverrideFromStorage: boolean,
    result: PullFromStorageInfo,
    options: PullFromStorageOptions<T>
): PullFromStorageInfo {
    const { meta, provider }: PullFromStorageOptions<T> = options;

    if (canBeOverrideFromStorage && meta.version !== provider.version) {
        const instance: NgxsDataMigrateStorage | undefined = (provider.stateInstance as Any) as NgxsDataMigrateStorage;
        const tryMigrate: boolean = !provider.skipMigrate && !!(instance?.ngxsDataStorageMigrate || provider.migrate);

        if (tryMigrate) {
            result = { ...result, versionMismatch: true };
        } else {
            result = { ...result, canBeOverrideFromStorage: false, versionMismatch: true };
        }
    }

    return result;
}
