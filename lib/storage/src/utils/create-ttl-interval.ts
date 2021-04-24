import { Fn } from '@angular-ru/common/typings';
import { NgxsDataInjector } from '@ngxs-labs/data/internals';
import { TtLCreatorOptions } from '@ngxs-labs/data/typings';
import { interval, Subscription } from 'rxjs';

import { ttlHandler } from './ttl-handler';

export function createTtlInterval(options: TtLCreatorOptions): void {
    const { provider, map }: TtLCreatorOptions = options;
    map.get(provider)?.subscription.unsubscribe();

    const watcher: Fn = (): void => {
        const startListen: string = new Date(Date.now()).toISOString();

        const subscription: Subscription = interval(provider.ttlDelay!).subscribe((): void =>
            ttlHandler(startListen, options, subscription)
        );

        map.set(provider, { subscription, startListen, endListen: null });
    };

    if (NgxsDataInjector.ngZone) {
        NgxsDataInjector.ngZone?.runOutsideAngular((): void => watcher());
    } else {
        watcher();
    }
}
