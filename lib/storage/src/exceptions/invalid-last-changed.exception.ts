export class InvalidLastChangedException extends Error {
    constructor(value: string | null) {
        super(`lastChanged key not found in object ${value}.`);
    }
}
