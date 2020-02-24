import { ActionType } from '@ngxs/store';

import { Any } from './any';
import { PlainObjectOf } from './plaing-object-of';

/**
 * @publicApi
 */
export type ActionEvent = ActionType & { payload: PlainObjectOf<Any> };
