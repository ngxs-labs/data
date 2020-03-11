import { Observable } from 'rxjs';

import { Any } from './any';

export type DispatchedResult = Any | Observable<Any> | null;
