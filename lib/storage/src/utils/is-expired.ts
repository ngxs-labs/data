export function isExpiredByTtl(expiry: Date): boolean {
    return Date.now() >= expiry.getTime();
}
