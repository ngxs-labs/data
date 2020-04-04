import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AmountState } from './amount.state';
import { PriceState } from './price.state';

@Component({
    selector: 'amount',
    templateUrl: './amount.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmountComponent {
    constructor(public price: PriceState, public amount: AmountState) {}
}
