## Quick Start

`app.module.ts`

```ts
import { NgxsModule } from '@ngxs/store';
import { NgxsDataPluginModule } from '@ngxs-labs/data';

@NgModule({
    imports: [
        // ..
        NgxsModule.forRoot([AppState]),
        NgxsDataPluginModule.forRoot()
    ]
    // ..
})
export class AppModule {}
```

`count.state.ts`

```ts
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Computed, DataAction, StateRepository } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
// ..

export interface CountModel {
    val: number;
}

@StateRepository()
@State({
    name: 'count',
    defaults: { val: 0 }
})
@Injectable()
export class CountState extends NgxsDataRepository<CountModel> {
    @Computed()
    public get values$() {
        return this.state$.pipe(map((state) => state.countSub));
    }

    @DataAction()
    public increment(): void {
        this.ctx.setState((state) => ({ val: state.val + 1 }));
    }

    @DataAction()
    public decrement(): void {
        this.ctx.setState((state) => ({ val: state.val - 1 }));
    }

    @Debounce()
    @DataAction()
    public setValueFromInput(@Payload('value') val: string | number): void {
        this.ctx.setState({ val: parseFloat(val) || 0 });
    }
}
```

`app.component.ts`

```ts
...

@Component({
  selector: 'app',
  template: `
    <b class="title">Selection:</b>
    counter.state$ = {{ counter.state$ | async | json }} <br />
    counter.values$ = {{ counter.values$ | async }} <br />

    <b class="title">Actions:</b>
    <button (click)="counter.increment()">increment</button>
    <button (click)="counter.decrement()">decrement</button>
    <button (click)="counter.reset()">reset</button>

    <b class="title">ngModel:</b>
    <input
        [ngModel]="counter.snapshot"
        (ngModelChange)="counter.setValueFromInput($event)"
    />

    (delay: 300ms)
  `
})
export class AppComponent {
  constructor(public counter: CountState) {}
}
```

#### Debugging

`Need provide logger-plugin`

```ts
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

@NgModule({
    imports: [
        // ..
        NgxsLoggerPluginModule.forRoot()
    ]
    // ..
})
export class AppModule {}
```

```ts
@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsDataRepository<string[]> {
    @DataAction()
    public addTodo(@Payload('todo') todo: string): void {
        if (todo) {
            this.ctx.setState((state) => state.concat(todo));
        }
    }

    @DataAction()
    public removeTodo(@Payload('idx') idx: number): void {
        this.ctx.setState((state) => state.filter((_: string, index: number): boolean => index !== idx));
    }
}
```

![](https://habrastorage.org/webt/6t/f5/ku/6tf5kuw5naqpgvyphebd4el_ync.png)
