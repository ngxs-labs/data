import { Any } from '@angular-ru/common/typings';
import { ActionType } from '@ngxs/store';
import { Observable } from 'rxjs';

import { EntityPatchValue, EntityStateValue } from './entity-types';
import { NgxsEntityCollections } from './ngxs-entity-collections';

export interface EntityContext<V, K extends string | number, C = Record<string, Any>> {
    getState(): NgxsEntityCollections<V, K, C>;

    setState(val: EntityStateValue<NgxsEntityCollections<V, K, C>>): void;

    patchState(val: EntityPatchValue<NgxsEntityCollections<V, K, C>>): void;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;
}
