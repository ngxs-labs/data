import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { Computed, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';

import { PriceState } from './price.state';

@StateRepository()
@State({
    name: 'amount',
    defaults: 20
})
@Injectable()
export class AmountState extends NgxsDataRepository<number> {
    constructor(private readonly price: PriceState) {
        super();
    }

    @Computed()
    public get sum(): number {
        return this.snapshot + this.price.snapshot;
    }

    public setAmount(value: string): void {
        this.setState(parseFloat(value));
    }
}
