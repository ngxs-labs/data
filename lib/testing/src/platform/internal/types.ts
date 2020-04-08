import { Any } from '@ngxs-labs/data/typings';

export type TestSpec = (...args: Any[]) => Promise<void>;
