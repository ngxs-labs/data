import { Injectable } from '@angular/core';
import { Persistence, StateRepository } from '@ngxs-labs/data/decorators';
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
export class CountSubState {}
