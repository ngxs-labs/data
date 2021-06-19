import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PersonService } from './person.service';
import { PersonModel } from './person-model';

@StateRepository()
@State<PersonModel>({
    name: 'person',
    defaults: { title: null!, description: null! }
})
@Injectable()
export class PersonState extends NgxsImmutableDataRepository<PersonModel> {
    constructor(private readonly personService: PersonService) {
        super();
    }

    public getContent(): Observable<PersonModel> {
        return this.personService.fetchAll().pipe(tap((content: PersonModel): void => this.setState(content)));
    }
}
