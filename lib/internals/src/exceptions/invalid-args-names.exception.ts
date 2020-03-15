export class InvalidArgsNamesException extends Error {
    constructor(name: string, method: string) {
        super(`An argument with the name '${name}' already exists in the method '${method}'`);
    }
}
