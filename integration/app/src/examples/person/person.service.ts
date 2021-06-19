import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PersonModel } from './person-model';

@Injectable()
export class PersonService {
    constructor(private readonly httpService: HttpClient) {}

    public fetchAll(): Observable<PersonModel> {
        return this.httpService
            .get<{ data: PersonModel }>('./app/json/person.json')
            .pipe(map((response: { data: PersonModel }): PersonModel => response.data));
    }
}
