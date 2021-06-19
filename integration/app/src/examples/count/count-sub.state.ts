import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { DataAction, Debounce, Named, Payload, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';

import { CountModel } from './count-model';

@Persistence({
    path: 'count.countSub.val',
    existingEngine: sessionStorage
})
@StateRepository()
@State<CountModel>({
    name: 'countSub',
    defaults: { val: 100 }
})
@Injectable()
export class CountSubState extends NgxsImmutableDataRepository<CountModel> {
    @Debounce()
    @DataAction()
    public setDebounceSubValue(@Payload('value') @Named('val') val: number): void {
        this.ctx.setState({ val });
    }
}
