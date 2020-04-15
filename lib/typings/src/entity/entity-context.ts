import { ActionType } from '@ngxs/store';
import { Observable } from 'rxjs';

import { EntityPatchValue, EntityStateValue } from './entity-types';
import { NgxsEntityCollections } from './ngxs-entity-collections';

export interface EntityContext<V, K extends string | number> {
    getState(): NgxsEntityCollections<V, K>;

    setState(val: EntityStateValue<NgxsEntityCollections<V, K>>): void;

    patchState(val: EntityPatchValue<NgxsEntityCollections<V, K>>): void;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;
}
