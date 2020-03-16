import { Injectable } from '@angular/core';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PersonModel } from './person.model';
import { PersonService } from './person.service';

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
