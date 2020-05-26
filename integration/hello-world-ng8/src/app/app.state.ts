import { State } from '@ngxs/store';
import { StateRepository, Persistence } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';

@Persistence()
@StateRepository()
@State<string>({
    name: 'app',
    defaults: 'hello world'
})
export class AppState extends NgxsDataRepository<string> {}
