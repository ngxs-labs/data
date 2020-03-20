import { Any } from '@ngxs-labs/data/typings';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function combineStream(dispatched: Observable<Any>, result: Observable<Any>): Observable<Any> {
    return forkJoin([dispatched, result]).pipe(map((combines: [Any, Any]): Any => combines.pop()));
}
