import { PersistenceProvider, RehydrateInfo } from '@ngxs-labs/data/typings';
import { getValue, setValue } from '@ngxs/store';
import { PlainObject } from '@ngxs/store/internals';

export function rehydrate<T>(states: PlainObject, provider: PersistenceProvider, data: T | null): RehydrateInfo {
    if (!provider.rehydrate) {
        return { states, rehydrateIn: false };
    }

    const prevData: T = getValue(states, provider.path!);
    if (JSON.stringify(prevData) !== JSON.stringify(data)) {
        states = setValue(states, provider.path!, data);
        return { states, rehydrateIn: true };
    }

    return { states, rehydrateIn: false };
}
