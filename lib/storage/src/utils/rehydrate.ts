import { PersistenceProvider } from '@ngxs-labs/data/typings';
import { getValue, setValue } from '@ngxs/store';
import { PlainObject } from '@ngxs/store/internals';

export function rehydrate<T>(states: PlainObject, provider: PersistenceProvider, data: T | null): PlainObject {
    if (!provider.rehydrate) {
        return states;
    }

    const prevData: T = getValue(states, provider.path!);
    if (JSON.stringify(prevData) !== JSON.stringify(data)) {
        states = setValue(states, provider.path!, data);
    }

    return states;
}
