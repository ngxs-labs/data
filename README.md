<p align="center">
  <img src="https://raw.githubusercontent.com/ngxs/store/master/docs/assets/logo.png">
  <br />
  <b>NGXS Persistence API (@ngxs-labs/data)</b> <br />
  <b>🚀 See it in action on <a href="https://stackblitz.com/edit/ngxs-labs-data">Stackblitz</a></b>
  <br />
</p>
  
<p align="center">
  
  <a href="https://travis-ci.org/ngxs-labs/data">
    <img src="https://travis-ci.org/ngxs-labs/data.svg?branch=master" />
  </a>
  <a href="https://badge.fury.io/js/%40ngxs-labs%2Fdata">
    <img src="https://badge.fury.io/js/%40ngxs-labs%2Fdata.svg" />
  </a>
  <a href="https://npm-stat.com/charts.html?package=%40ngxs-labs%2Fdata&from=2019-09-01">
    <img src="https://img.shields.io/npm/dt/@ngxs-labs/data.svg" />
  </a>
</p>

---

## Introduction

NGXS Persistence API is an extension based the Repository Design Pattern that offers a gentle introduction to NGXS by
simplifying management of entities or plain data while reducing the amount of explicitness.

![](https://habrastorage.org/webt/jd/t4/wo/jdt4woihu-chhiwlqqd4eogpelu.png)

### Key Concepts

-   the main purpose of this extension is to provide the necessary layer of abstraction for states.
-   automates the creation of actions, dispatchers, and selectors for each entity type.

### Registering plugin

```ts
...
import { NgxsModule } from '@ngxs/store';
import { NgxsDataPluginModule } from '@ngxs-labs/data';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([ .. ]),
    NgxsDataPluginModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### CountState

count.state.ts

```ts
import { action, Immutable, NgxsDataRepository, query, StateRepository } from '@ngxs-labs/data';
import { State } from '@ngxs/store';
import { Observable } from 'rxjs';

export interface CountModel {
    val: number;
}

const COUNT_TOKEN = new StateToken<CountModel>('count');

@StateRepository()
@State({
    name: COUNT_TOKEN,
    defaults: { val: 0 }
})
@Injectable()
export class CountState extends NgxsDataRepository<CountModel> {
    @Select((state) => state.val)
    public values$: Observable<number>;

    @action()
    public increment(): void {
       this.ctx.setState((state: Immutable<CountModel>) => ({ val: state.val + 1 }));
    }

    @action()
    public decrement(): void {
       this.ctx.setState((state: Immutable<CountModel>) => ({ val: state.val - 1 }));
    }

    @action({ async: true, debounce: 300 })
    public setValueFromInput(val: string | number): void {
        this.ctx.setState({ val: parseFloat(val as string) || 0 });
    }
}
```

app.component.ts

```ts
...

@Component({
  selector: 'app',
  template: `
    counter.values$ = {{ counter.values$ | async }} <br />
    counter.state$ = {{ counter.state$ | async | json }} <br />
    <br />

    <b>form</b>
    <br />ngModel

    <input type="text" [ngModel]="counter.values$ | async" (ngModelChange)="counter.setValueFromInput($event)" />

    <br />actions

    <button (click)="counter.increment()">increment</button>
    <button (click)="counter.decrement()">decrement</button>
    <button (click)="counter.reset()">reset</button>
  `
})
export class AppComponent {
  constructor(public counter: CountState) {}
}
```

Benefits:

-   No breaking changes
-   Angular-way (service abstraction)
-   Improved debugging (payload by arguments)
-   Automatic action naming by service methods
-   Support debounce for throttling dispatch
-   Custom select data with `this.state$.pipe(..)`
-   Works with NGXS Lifecycle

<details>
<summary>Debug example</summary>
<div><br>
  
![](https://habrastorage.org/webt/hg/gz/92/hggz92co_9mvmk8rfqkxfud0bq8.png)

![](https://habrastorage.org/webt/60/7v/ja/607vja_6rkbxsnlfidusmv3263u.png)

<br>
</div>

</details>

### TODO

-   [x] NgxsDataRepository<T>
-   [ ] NgxsEntityRepository<T>
-   [ ] State persistence (LocalStorage, SessionStorage)
