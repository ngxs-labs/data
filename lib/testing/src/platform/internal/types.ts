import { Any } from '@angular-ru/common/typings';

export type TestSpec = (...args: Any[]) => Promise<void>;
