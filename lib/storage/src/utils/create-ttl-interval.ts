import { NgxsDataInjector } from '@ngxs-labs/data/internals';
import { StorageMeta, TTL_EXPIRED_STRATEGY, TtLCreatorOptions } from '@ngxs-labs/data/typings';
import { interval, Subscription } from 'rxjs';

import { ensureKey } from './ensure-key';
import { firedStateWhenInvalid } from './fire-state-when-invalid';
import { isExpiredByTtl } from './is-expired';
import { parseStorageMeta } from './parse-storage-meta';

// eslint-disable-next-line max-lines-per-function
export function createTtlInterval(options: TtLCreatorOptions): void {
    const { provider, expiry, map, engine }: TtLCreatorOptions = options;
    map.get(provider)?.subscription.unsubscribe();
    // eslint-disable-next-line max-lines-per-function
    NgxsDataInjector.ngZone?.runOutsideAngular((): void => {
        const startListen: string = new Date(Date.now()).toISOString();
        // eslint-disable-next-line max-lines-per-function
        const subscription: Subscription = interval(provider.ttlDelay!).subscribe((): void => {
            const key: string = ensureKey(provider);
            const value: string | null = engine.getItem(key);

            if (value) {
                if (isExpiredByTtl(expiry)) {
                    const endListen: string = new Date(Date.now()).toISOString();

                    switch (provider.ttlExpiredStrategy) {
                        case TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED:
                            engine.removeItem(key);
                            break;
                        case TTL_EXPIRED_STRATEGY.SET_NULL_DATA_AFTER_EXPIRED:
                            // eslint-disable-next-line no-case-declarations
                            const meta: StorageMeta<unknown> = parseStorageMeta(value);
                            meta.data = null;
                            engine.setItem(key, JSON.stringify(meta));
                            break;
                        case TTL_EXPIRED_STRATEGY.DO_NOTHING_AFTER_EXPIRED:
                        default:
                            break;
                    }

                    firedStateWhenInvalid(key, options);

                    subscription.unsubscribe();
                    map.set(provider, { subscription, startListen, endListen });
                }
            } else {
                subscription.unsubscribe();
            }
        });

        map.set(provider, { subscription, startListen, endListen: null });
    });
}
