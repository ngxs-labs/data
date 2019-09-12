import { Component, OnInit } from '@angular/core';
import { CountRepository } from './count/count.repository';

@Component({
  selector: 'first',
  template: `
    state$ = {{ counter.value$ | async }}
    <br />
    <br />

    <button (click)="counter.increment()">increment</button>
    <button (click)="counter.decrement()">decrement</button>

    <br />
    <br />

    <input type="text" #inputElement />
    <button (click)="counter.setValueFromInput(inputElement.value)">setValueFromInput</button>

    <br />
    <br />

    <button (click)="counter.reset()">reset</button>
  `
})
export class FirstComponent {
  constructor(public counter: CountRepository) {}
}
