import { Type } from '@angular/core';
import { Any, PlainObjectOf } from '@angular-ru/common/typings';

export function dynamicActionByType(type: string): Type<Any> {
    return class NgxsDataAction {
        constructor(payload: PlainObjectOf<Any> | null) {
            if (payload) {
                Object.keys(payload).forEach((key: string): void => {
                    (this as Any)[key] = payload[key];
                });
            }
        }

        public static get type(): string {
            return type;
        }
    };
}
