import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { PersonState } from './person.state';
import { PersonModel } from './person-model';

@Injectable()
export class PersonResolver implements Resolve<PersonModel> {
    constructor(private readonly personState: PersonState) {}

    public resolve(): Observable<PersonModel> {
        return this.personState.getContent();
    }
}
