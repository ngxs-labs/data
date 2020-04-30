import { ActionType } from '@ngxs/store';
import { Observable } from 'rxjs';

import { EntityPatchValue, EntityStateValue } from './entity-types';
import { NgxsEntityCollections } from './ngxs-entity-collections';

export interface EntityContext<
    V,
    K extends string | number,
    C extends NgxsEntityCollections<V, K> = NgxsEntityCollections<V, K>
> {
    getState(): C;

    setState(val: EntityStateValue<C>): void;

    patchState(val: EntityPatchValue<C>): void;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;
}
