import { Any } from '@ngxs-labs/data/typings';

// eslint-disable-next-line max-lines-per-function
export const ngxsDeepFreeze: (value: Any) => Any = (value: Any): Any => {
    const isObject: boolean = typeof value === 'object' && value !== null;
    const isDate: boolean = value instanceof Date;
    const skipFreeze: boolean = !isObject || isDate;

    if (skipFreeze) {
        return value;
    }

    Object.freeze(value);

    const oIsFunction: boolean = typeof value === 'function';
    const hasOwnProp: (v: PropertyKey) => boolean = Object.prototype.hasOwnProperty;

    // eslint-disable-next-line complexity
    Object.getOwnPropertyNames(value).forEach((prop: string): void => {
        if (
            hasOwnProp.call(value, prop) &&
            (oIsFunction ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments' : true) &&
            value[prop] !== null &&
            (typeof value[prop] === 'object' || typeof value[prop] === 'function') &&
            !Object.isFrozen(value[prop])
        ) {
            ngxsDeepFreeze(value[prop]);
        }
    });

    return value;
};
