import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CountState } from './count.state';

@Component({
    selector: 'count',
    templateUrl: 'count.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountComponent {
    constructor(public counter: CountState) {}
}
