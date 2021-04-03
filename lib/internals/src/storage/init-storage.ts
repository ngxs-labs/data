import { ReplaySubject } from 'rxjs';

export const STORAGE_INIT_EVENT: { firstInitialized: boolean; events$: ReplaySubject<void> } = {
    firstInitialized: false,
    events$: new ReplaySubject<void>(1)
};
