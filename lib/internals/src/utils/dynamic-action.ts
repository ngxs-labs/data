import { NgxsActionPayloader } from './action-payloader';

export function dynamicActionByType(type: string): typeof NgxsActionPayloader {
    return class NgxsDataAction extends NgxsActionPayloader {
        public static get type(): string {
            return type;
        }
    };
}
