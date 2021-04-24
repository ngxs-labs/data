import { Fn } from '@angular-ru/common/typings';

import { ComputedOptions } from './computed-options';

export type ComputedCacheMap = WeakMap<Fn, ComputedOptions>;
