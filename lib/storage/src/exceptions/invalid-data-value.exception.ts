export class InvalidDataValueException extends Error {
    constructor() {
        super(`missing key 'data' or it's value not serializable.`);
    }
}
