import { Any } from '@angular-ru/common/typings';
import { isFalsy, isTruthy } from '@angular-ru/common/utils';
import { getValue, setValue } from '@ngxs/store';
import { PlainObject } from '@ngxs/store/internals';
import { MigrateFn, NgxsDataMigrateStorage, RehydrateInfo, RehydrateInfoOptions } from '@ngxs-labs/data/typings';

import { ensurePath } from './ensure-path';

// eslint-disable-next-line max-lines-per-function
export function rehydrate<T>(params: RehydrateInfoOptions<T>): RehydrateInfo {
    let states: PlainObject = params.states;
    const { provider, data, info }: RehydrateInfoOptions<T> = params;

    if (isFalsy(provider.rehydrate)) {
        return { states, rehydrateIn: false };
    }

    const path: string = ensurePath(provider);
    const prevData: T = getValue(states, path);

    if (isTruthy(info.versionMismatch)) {
        const stateInstance: Any = provider.stateInstance as Any;
        const instance: NgxsDataMigrateStorage = stateInstance as NgxsDataMigrateStorage;
        const migrateFn: MigrateFn = provider.migrate ?? instance.ngxsDataStorageMigrate?.bind(provider.stateInstance);
        const newMigrationData: PlainObject = migrateFn?.(prevData, data);
        states = setValue(states, path, newMigrationData);
        return { states, rehydrateIn: true };
    } else if (JSON.stringify(prevData) !== JSON.stringify(data)) {
        states = setValue(states, path, data);
        return { states, rehydrateIn: true };
    }

    return { states, rehydrateIn: false };
}
