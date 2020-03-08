export class NotImplementedStorageException extends Error {
    constructor() {
        super(`StorageEngine instance should be implemented by DataStorageEngine interface`);
    }
}
