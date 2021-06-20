import { Any } from '@angular-ru/common/typings';
import { isNotNil } from '@angular-ru/common/utils';
import { NgxsDataInjector } from '@ngxs-labs/data/internals';
import { NgxsDataAfterExpired, NgxsDataExpiredEvent, TtLCreatorOptions } from '@ngxs-labs/data/typings';

export function firedStateWhenExpired(key: string, options: TtLCreatorOptions): void {
    const { provider, expiry }: TtLCreatorOptions = options;

    const event: NgxsDataExpiredEvent = {
        key,
        expiry: expiry?.toISOString(),
        timestamp: new Date(Date.now()).toISOString()
    };

    const instance: NgxsDataAfterExpired | undefined = provider.stateInstance as Any as NgxsDataAfterExpired;
    instance?.expired$?.next(event);

    if (isNotNil(instance?.ngxsDataAfterExpired)) {
        if (isNotNil(NgxsDataInjector.ngZone)) {
            NgxsDataInjector.ngZone?.run((): void => instance?.ngxsDataAfterExpired?.(event, provider));
        } else {
            instance?.ngxsDataAfterExpired?.(event, provider);
        }
    }
}
