import { Observable } from 'rxjs';

import { Any } from './any';

export interface ComputedOptions {
    sequenceId: number;
    isObservable: boolean;
    value: Any | Observable<Any>;
}
