import { TtLCreatorOptions } from '@ngxs-labs/data/typings';
import { Subscription } from 'rxjs';

import { ensureKey } from './ensure-key';
import { firedStateWhenExpired } from './fire-state-when-expired';
import { isExpiredByTtl } from './is-expired';
import { ttlStrategyHandler } from './ttl-strategy-handler';

export function ttlHandler(start: string, options: TtLCreatorOptions, subscription: Subscription): void {
    const { provider, expiry, map, engine }: TtLCreatorOptions = options;
    const key: string = ensureKey(provider);
    const value: string | null = engine.getItem(key);

    if (value) {
        if (isExpiredByTtl(expiry)) {
            const endListen: string = new Date(Date.now()).toISOString();

            ttlStrategyHandler(key, value, options);
            firedStateWhenExpired(key, options);

            subscription.unsubscribe();
            map.set(provider, { subscription, startListen: start, endListen });
        }
    } else {
        subscription.unsubscribe();
    }
}
