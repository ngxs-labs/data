import { Any } from '@angular-ru/common/typings';
import { isFalsy, isNotNil } from '@angular-ru/common/utils';
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
    let newResult: PullFromStorageInfo = result;
    const { meta, provider }: PullFromStorageOptions<T> = options;

    if (canBeOverrideFromStorage && existTtl(provider)) {
        const expiry: Date = new Date(meta.expiry!);
        const expiryExist: boolean = !isNaN(expiry.getTime());

        if (expiryExist) {
            if (isExpiredByTtl(expiry)) {
                newResult = { canBeOverrideFromStorage: false, expired: true, expiry, versionMismatch: false };
            } else {
                newResult = { canBeOverrideFromStorage, expired: false, expiry, versionMismatch: false };
            }
        }
    }

    return newResult;
}

function ensureInfoByVersionMismatch<T>(
    canBeOverrideFromStorage: boolean,
    result: PullFromStorageInfo,
    options: PullFromStorageOptions<T>
): PullFromStorageInfo {
    let newResult: PullFromStorageInfo = result;
    const { meta, provider }: PullFromStorageOptions<T> = options;

    if (canBeOverrideFromStorage && meta.version !== provider.version) {
        const instance: NgxsDataMigrateStorage | undefined = provider.stateInstance as Any as NgxsDataMigrateStorage;
        const tryMigrate: boolean =
            isFalsy(provider.skipMigrate) && !!(instance?.ngxsDataStorageMigrate || provider.migrate);

        if (tryMigrate) {
            newResult = { ...result, versionMismatch: true };
        } else {
            newResult = { ...result, canBeOverrideFromStorage: false, versionMismatch: true };
        }
    }

    return newResult;
}
