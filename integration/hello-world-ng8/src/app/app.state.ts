import { Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';

@Persistence()
@StateRepository()
@State<string>({
    name: 'app',
    defaults: 'hello world'
})
export class AppState extends NgxsDataRepository<string> {}
