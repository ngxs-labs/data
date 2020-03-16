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
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { action, StateRepository } from '@ngxs-labs/data/decorators';
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
export class CountState extends NgxsImmutableDataRepository<CountModel> {
    public readonly values$ = this.state$.pipe(map((state) => state.val));

    @action()
    public increment(): void {
        this.ctx.setState((state) => ({ val: state.val + 1 }));
    }

    @action()
    public decrement(): void {
        this.ctx.setState((state) => ({ val: state.val - 1 }));
    }

    @debounce()
    @action()
    public setValueFromInput(@payload('value') val: string | number): void {
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
        [ngModel]="counter.values$ | async"
        (ngModelChange)="counter.setValueFromInput($event)"
    />

    (delay: 300ms)
  `
})
export class AppComponent {
  constructor(public counter: CountState) {}
}
```

#### Demo

![](https://habrastorage.org/webt/8p/nt/hb/8pnthbvoorw2cf6lvmr-psi0kvc.png)

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
export class TodoState extends NgxsImmutableDataRepository<string[]> {
    @action()
    public addTodo(@payload('todo') todo: string): void {
        if (todo) {
            this.ctx.setState((state: Immutable<string[]>): Immutable<string[]> => state.concat(todo));
        }
    }

    @action()
    public removeTodo(@payload('idx') idx: number): void {
        this.ctx.setState(
            (state: Immutable<string[]>): Immutable<string[]> =>
                state.filter((_: string, index: number): boolean => index !== idx)
        );
    }
}
```

![](https://habrastorage.org/webt/6t/f5/ku/6tf5kuw5naqpgvyphebd4el_ync.png)
