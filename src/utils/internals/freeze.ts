import { Any } from '@ngxs-labs/data/internals';

export const ngxsDeepFreeze = (value: Any) => {
    const isObject: boolean = typeof value === 'object' && value !== null;
    const isDate: boolean = value instanceof Date;
    const skipFreeze: boolean = !isObject || isDate;

    if (skipFreeze) {
        return value;
    }

    Object.freeze(value);

    const oIsFunction = typeof value === 'function';
    const hasOwnProp = Object.prototype.hasOwnProperty;

    Object.getOwnPropertyNames(value).forEach(function(prop) {
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
