import { DatePipe } from '@angular/common';
import { Any } from '@ngxs-labs/data/typings';

export class Logger {
    private static get now(): string | null {
        return new DatePipe('en-EU').transform(Date.now(), 'dd.MM.yyyy HH:mm:ss.SSS');
    }

    public get log(): (...args: Any[]) => void {
        // eslint-disable-next-line no-console
        return console.log.bind(console, `${Logger.now} [DEBUG]: @ngxs-labs/data -`);
    }
}
