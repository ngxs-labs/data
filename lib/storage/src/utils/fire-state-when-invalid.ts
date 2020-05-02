import { NgxsDataInjector } from '@ngxs-labs/data/internals';
import { Any, NgxsDataAfterExpired, NgxsDataExpiredEvent, TtLCreatorOptions } from '@ngxs-labs/data/typings';

export function firedStateWhenInvalid(key: string, options: TtLCreatorOptions): void {
    const { provider, expiry }: TtLCreatorOptions = options;

    const event: NgxsDataExpiredEvent = {
        key,
        expiry: expiry.toISOString(),
        timestamp: new Date(Date.now()).toISOString()
    };

    const instance: NgxsDataAfterExpired | undefined = (provider.stateInstance as Any) as NgxsDataAfterExpired;
    instance?.expired$?.next(event);

    if (instance?.ngxsDataAfterExpired) {
        if (NgxsDataInjector.ngZone) {
            NgxsDataInjector.ngZone?.run((): void => instance?.ngxsDataAfterExpired?.(event, provider));
        } else {
            instance?.ngxsDataAfterExpired?.(event, provider);
        }
    }
}
