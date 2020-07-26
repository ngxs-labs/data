import { Any } from '@angular-ru/common/typings';

import { getStackTraceLine } from './get-stack-trace';

declare const global: Any;

((window || global) as Any)['IS_PATCHED'] = false;

export function patchConsoleLog(): void {
    if (((window || global) as Any)['IS_PATCHED']) {
        return;
    }

    // eslint-disable-next-line no-console
    const originConsoleLog: (...messages: Any[]) => void = console.log;

    // eslint-disable-next-line no-console
    console.log = (...args: Any[]): void => {
        const accessedArgs: Any[] =
            typeof args[0] === 'string' && args[0]?.indexOf('Angular is running in the development mode') !== -1
                ? args.slice(1)
                : args;

        if (accessedArgs.length > 0) {
            originConsoleLog.apply(console, accessedArgs);
            // eslint-disable-next-line no-console
            console.info(getStackTraceLine());
        }
    };

    ((window || global) as Any)['IS_PATCHED'] = true;
}
