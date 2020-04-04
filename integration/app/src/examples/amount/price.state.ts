import { Injectable } from '@angular/core';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { State } from '@ngxs/store';

@StateRepository()
@State({
    name: 'price',
    defaults: 10
})
@Injectable()
export class PriceState extends NgxsDataRepository<number> {
    public setPrice(value: string): void {
        this.setState(parseFloat(value));
    }
}
