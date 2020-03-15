import { Any, PlainObjectOf } from '@ngxs-labs/data/typings';

export class NgxsActionPayloader {
    public static type: string = '';
    constructor(payload: PlainObjectOf<Any> | null) {
        if (payload) {
            Object.keys(payload).forEach((key: string): void => {
                (this as Any)[key] = payload[key];
            });
        }
    }
}
