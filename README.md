<p align="center">
  <img src="https://raw.githubusercontent.com/ngxs/store/master/docs/assets/logo.png">
  <br />
  <b>NGXS Persistence API (@ngxs-labs/data)</b>
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

NGXS Persistence API is an extension based the Repository Design Pattern that offers a gentle introduction to NGXS by simplifying management of entities or plain data while reducing the amount of explicitness.

![](https://habrastorage.org/webt/jd/t4/wo/jdt4woihu-chhiwlqqd4eogpelu.png)

### Key Concepts

- the main purpose of this extension is to provide the necessary layer of abstraction for states.
- automates the creation of actions, dispatchers, and selectors for each entity type.

### Registering plugin

```ts
...
import { NgxsModule, ɵn as StateFactory, ɵq as StateContextFactory } from '@ngxs/store';
import { NgxsDataPluginModule } from '@ngxs-labs/data';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([ CountState ], {
      developmentMode: !environment.production
    }),
    NgxsLoggerPluginModule.forRoot(),
    NgxsDataPluginModule.forRoot({ factory: StateFactory, context: StateContextFactory })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Unfortunately, in runtime we cannot access some internal ngxs functionality, 
so for now you need to computed class exports `StateFactory`, `StateContextFactory`.

Note: please note that the symbols `ɵn, ɵq` may different in your code.

### CountState

count.state.ts

```ts
import { StateRepository, NgxsDataRepository, action, Immutable } from '@ngxs-labs/data';
import { State } from '@ngxs/store';

export interface CountModel {
  val: number;
}

@State({
  name: 'count',
  defaults: { val: 0 }
})
@StateRepository()
export class CountState extends NgxsDataRepository<number> {
  public get value$(): Observable<number> {
    return this.state$.pipe(map((val: CountModel) => val.val));
  }

  @action()
  public increment(): Immutable<CountModel> {
    return this.ctx.setState((state: Immutable<CountModel>) => ({
      val: state.val + 1
    }));
  }

  @action()
  public decrement(): Immutable<CountModel> {
    return this.ctx.setState((state: Immutable<CountModel>) => ({
      val: state.val - 1
    }));
  }

  @action()
  public setValueFromInput(val: string): void {
    this.ctx.setState({ val: parseFloat(val) });
  }
}
```

app.component.ts

```ts
...

@Component({
  selector: 'app',
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
export class AppComponent {
  constructor(public counter: CountState) {}
}
```

Benefits:

- No breaking changes
- Angular-way (service abstraction)
- Improved debugging (payload by arguments)
- Automatic action naming by service methods
- Custom select data with `this.state$.pipe(..)`
- Works with NGXS Lifecycle

<details>
<summary>Debug example</summary>
<div><br>
  
![](https://habrastorage.org/webt/hg/gz/92/hggz92co_9mvmk8rfqkxfud0bq8.png)

![](https://habrastorage.org/webt/60/7v/ja/607vja_6rkbxsnlfidusmv3263u.png)

<br>
</div>

</details>

### TODO

- [x] NgxsDataRepository<T>
- [ ] NgxsEntityRepository<T>
- [ ] State persistence (Local, Cookie, IndexDB)
