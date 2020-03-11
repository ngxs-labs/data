import { isDevMode } from '@angular/core';
import { checkExistNgZone, NgxsDataInjector } from '@ngxs-labs/data/internals';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { Any, Descriptor } from '@ngxs-labs/data/typings';

const DEFAULT_TIMEOUT: number = 300;

export function debounce(timeout: number = DEFAULT_TIMEOUT): MethodDecorator {
    let timeoutRef: number | null = null;
    return <T>(target: T, name: string | symbol, descriptor: Descriptor): Descriptor => {
        const originalMethod: Any = descriptor.value;

        descriptor.value = function(...args: Any[]): Any {
            checkExistNgZone();

            NgxsDataInjector.ngZone?.runOutsideAngular((): void => {
                window.clearTimeout(timeoutRef!);
                timeoutRef = window.setTimeout((): void => {
                    const result: Any = originalMethod.apply(this, args);

                    if (result && isDevMode()) {
                        console.warn(NGXS_DATA_EXCEPTIONS.NGXS_DATA_ASYNC_ACTION_RETURN_TYPE, result);
                    }
                }, timeout);
            });
        };

        return descriptor;
    };
}
