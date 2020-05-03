import { Any, MigrateFn, NgxsDataMigrateStorage, RehydrateInfo, RehydrateInfoOptions } from '@ngxs-labs/data/typings';
import { getValue, setValue } from '@ngxs/store';
import { PlainObject } from '@ngxs/store/internals';

export function rehydrate<T>(params: RehydrateInfoOptions<T>): RehydrateInfo {
    let states: PlainObject = params.states;
    const { provider, data, info }: RehydrateInfoOptions<T> = params;

    if (!provider.rehydrate) {
        return { states, rehydrateIn: false };
    }

    const prevData: T = getValue(states, provider.path!);

    if (info.versionMismatch) {
        const stateInstance: Any = provider.stateInstance as Any;
        const instance: NgxsDataMigrateStorage = stateInstance as NgxsDataMigrateStorage;
        const migrateFn: MigrateFn = provider.migrate || instance.ngxsDataStorageMigrate?.bind(provider.stateInstance);
        const newMigrationData: PlainObject = migrateFn?.(prevData, data);
        states = setValue(states, provider.path!, newMigrationData);
        return { states, rehydrateIn: true };
    } else if (JSON.stringify(prevData) !== JSON.stringify(data)) {
        states = setValue(states, provider.path!, data);
        return { states, rehydrateIn: true };
    }

    return { states, rehydrateIn: false };
}
