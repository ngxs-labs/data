const SPACE: number = 4;

export class InvalidStructureDataException extends Error {
    constructor(message: string) {
        super(
            `${message}. \nIncorrect structure for deserialization!!! Your structure should be like this: \n${JSON.stringify(
                { lastChanged: '2020-01-01T12:00:00.000Z', data: '{}', version: 1 },
                null,
                SPACE
            )}`
        );
    }
}
