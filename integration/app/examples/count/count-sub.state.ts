import { Persistence, StateRepository } from '@ngxs-labs/data';
import { State } from '@ngxs/store';
import { Injectable } from '@angular/core';

import { CountModel } from './count.model';

const options = [{ path: 'count.countSub.val', existingEngine: sessionStorage }];

@Persistence(options)
@StateRepository()
@State<CountModel>({
    name: 'countSub',
    defaults: { val: 100 }
})
@Injectable()
export class CountSubState {}
