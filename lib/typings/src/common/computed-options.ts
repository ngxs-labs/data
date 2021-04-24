import { Any } from '@angular-ru/common/typings';
import { Observable } from 'rxjs';

export interface ComputedOptions {
    sequenceId: number;
    isObservable: boolean;
    value: Any | Observable<Any>;
}
