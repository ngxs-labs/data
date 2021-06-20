import { isNil } from '@angular-ru/common/utils';

export function isExpiredByTtl(expiry?: Date | null): boolean {
    return isNil(expiry) ? true : Date.now() >= expiry.getTime();
}
