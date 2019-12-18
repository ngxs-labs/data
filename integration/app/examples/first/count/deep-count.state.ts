import { Persistence, StateRepository } from '@ngxs-labs/data';
import { State } from '@ngxs/store';
import { Injectable } from '@angular/core';

import { CountModel } from './count.model';

@Persistence([{ path: 'count.deepCount.val', existingEngine: sessionStorage }])
@StateRepository()
@State<CountModel>({
    name: 'deepCount',
    defaults: { val: 100 }
})
@Injectable()
export class DeepCountState {}
