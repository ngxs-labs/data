import { EntityCollections, EntityPatchValue, EntityStateValue } from '@angular-ru/common/entity';
import { Any } from '@angular-ru/common/typings';
import { ActionType } from '@ngxs/store';
import { Observable } from 'rxjs';

export interface EntityContext<V, K extends string | number, C = Record<string, Any>> {
    getState(): EntityCollections<V, K, C>;

    setState(val: EntityStateValue<EntityCollections<V, K, C>>): void;

    patchState(val: EntityPatchValue<EntityCollections<V, K, C>>): void;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;
}
