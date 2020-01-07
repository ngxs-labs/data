export function actionNameCreator(stateName: string | null, method: string, argumentsNames: string[]): string {
    const argsList: string = argumentsNames.join(', ');
    return `@${stateName}.${method}(${argsList})`;
}
