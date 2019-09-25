import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodoState } from './todo/todo.state';

@Component({
    selector: 'first',
    templateUrl: './second.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondComponent {
    constructor(public todo: TodoState) {}
}
