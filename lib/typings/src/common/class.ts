import { Any } from './any';

// eslint-disable-next-line @typescript-eslint/type-annotation-spacing
export type ClassType = new (...args: Any[]) => {};
