import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CountState } from './count/count.state';

@Component({
  selector: 'first',
  templateUrl: 'first.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirstComponent {
  constructor(public counter: CountState) {}
}
