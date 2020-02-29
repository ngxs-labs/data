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
import { action, NgxsDataRepository, StateRepository } from '@ngxs-labs/data';
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
    public readonly values$ = this.state$.pipe(map((state) => state.val));

    @action()
    public increment(): void {
        this.ctx.setState((state) => ({ val: state.val + 1 }));
    }

    @action()
    public decrement(): void {
        this.ctx.setState((state) => ({ val: state.val - 1 }));
    }

    @action({ async: true, debounce: 300 })
    public setValueFromInput(val: string | number): void {
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

<details>
<summary>Redux logger example</summary>
<div><br>
  
![](https://habrastorage.org/webt/hg/gz/92/hggz92co_9mvmk8rfqkxfud0bq8.png)

![](https://habrastorage.org/webt/60/7v/ja/607vja_6rkbxsnlfidusmv3263u.png)

<br>
</div>

</details>
