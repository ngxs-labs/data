import { Any } from '@ngxs-labs/data/typings';
import { isObservable } from 'rxjs';

export function itObservable(value: Any): boolean {
    let observable: boolean = false;

    if (isObservable(value)) {
        observable = true;
    }

    return observable;
}
