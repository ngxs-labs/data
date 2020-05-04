export function getStackTraceLine(): string {
    let stack: string;

    try {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('');
    } catch (error) {
        stack = error.stack || '';
    }

    return (
        stack
            .split('\n')
            .map((line: string): string => line.trim())
            // eslint-disable-next-line no-magic-numbers
            .splice(stack[0] === 'Error' ? 2 : 1)?.[2]
    );
}
