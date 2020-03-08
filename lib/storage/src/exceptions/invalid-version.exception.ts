export class InvalidVersionException extends Error {
    constructor(value: number | undefined) {
        super(
            `It's not possible to determine version (${value}), since it must be a integer type and must equal or more than 1.`
        );
    }
}
