import { Injectable } from '@angular/core';
import { DataAction, debounce, named, payload, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { PersistenceProvider } from '@ngxs-labs/data/typings';
import { State } from '@ngxs/store';

import { CountModel } from './count.model';

const options: PersistenceProvider[] = [{ path: 'count.countSub.val', existingEngine: sessionStorage }];

@Persistence(options)
@StateRepository()
@State<CountModel>({
    name: 'countSub',
    defaults: { val: 100 }
})
@Injectable()
export class CountSubState extends NgxsImmutableDataRepository<CountModel> {
    @debounce()
    @DataAction()
    public setDebounceSubValue(@payload('value') @named('val') val: number): void {
        this.ctx.setState({ val });
    }
}
