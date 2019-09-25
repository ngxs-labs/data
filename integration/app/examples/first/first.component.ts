import { Component } from '@angular/core';
import { CountState } from './count/count.state';

@Component({
    selector: 'first',
    templateUrl: 'first.component.html'
})
export class FirstComponent {
    constructor(public counter: CountState) {}
}
