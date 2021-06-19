import { isNotNil } from '@angular-ru/common/utils';

import { MethodArgsRegistry } from '../method-args-registry/method-args-registry';

interface ActionNameCreatorOptions {
    statePath: string;
    methodName: string;
    argumentsNames: string[];
    argumentRegistry?: MethodArgsRegistry;
}

export function actionNameCreator(options: ActionNameCreatorOptions): string {
    const { statePath, argumentsNames, methodName, argumentRegistry }: ActionNameCreatorOptions = options;

    let argsList: string = '';
    for (let index: number = 0; index < argumentsNames.length; index++) {
        if (isNotNil(argumentRegistry?.getArgumentNameByIndex(index))) {
            argsList += argumentRegistry?.getArgumentNameByIndex(index);
        } else if (isNotNil(argumentRegistry?.getPayloadTypeByIndex(index))) {
            argsList += argumentRegistry?.getPayloadTypeByIndex(index);
        } else {
            argsList += `$arg${index}`;
        }

        if (index !== argumentsNames.length - 1) {
            argsList += ', ';
        }
    }

    return `@${statePath.replace(/\./g, '/')}.${methodName}(${argsList})`;
}
