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
  <a href="https://coveralls.io/github/ngxs-labs/data?branch=master">
    <img src="https://coveralls.io/repos/github/ngxs-labs/data/badge.svg?branch=master" />
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

### StateRepository `decorator`

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
    @Select((store) => store.count.val)
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

### Persistence `decorator`

```ts
@Persistence()
@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsDataRepository<string[]> {}
```

`@Persistence()` - If you add current decorator without options, then the `todo` state will synchronize with
LocalStorage by default.

![](https://habrastorage.org/webt/p_/ur/jw/p_urjwost3fn2n-ogpduwjnz8zo.png)

In more complex cases, when you need to use other storage, or you want to save part of the state, you can use the
complex options:

```ts
export interface ParentCountModel {
    val: number;
    deepCount?: CountModel;
}

export interface CountModel {
    val: number;
}

const options: PersistenceProvider[] = [
    {
        path: 'count.deepCount.val',
        existingEngine: sessionStorage,
        prefixKey: '@mycompany.store.',
        ttl: 60 * 60 * 24 * 1000 // 24 hour
    }
];

@Persistence(options)
@StateRepository()
@State<CountModel>({
    name: 'deepCount',
    defaults: { val: 100 }
})
@Injectable()
export class DeepCountState {}

@StateRepository()
@State<ParentCountModel>({
    name: 'count',
    defaults: { val: 0 },
    children: [DeepCountState]
})
@Injectable()
export class CountState extends NgxsDataRepository<CountModel> {}
```

![](https://habrastorage.org/webt/kk/gk/lb/kkgklbnwopcbsifj78x4muwvxyk.png)

```ts
interface CommonPersistenceProvider {
    /**
     * Path for slice
     * default: state.name
     */
    path: string;
    /**
     * Version for next migrate
     * default: 1
     */
    version?: number;
    /**
     * Time to live in ms
     * default: -1
     */
    ttl?: number;
    /**
     * decode/encoded
     */
    decode?: 'base64' | 'none';
    /**
     * prefix for key
     * default: '@ngxs.store.'
     */
    prefixKey?: string;
    /**
     * sync with null value from storage
     * default: false
     */
    nullable?: boolean;
}

interface ExistingEngineProvider extends CommonPersistenceProvider {
    /**
     * Storage container
     * default: window.localStorage
     */
    existingEngine: DataStorageEngine;
}

interface UseClassEngineProvider extends CommonPersistenceProvider {
    /**
     * Storage class from DI
     */
    useClass: Type<unknown>;
}
```

### Custom Storage

```ts
@Persistance([{ path: 'secureState', useClass: SecureStorageService }])
@StateRepository()
@State<SecureModel>({
    name: 'secureState',
    defaults: {
        login: null,
        credential: null,
        password: null
    }
})
@Injectable()
export class SecureState extends NgxsDataRepository<SecureModel> {}
```

```ts
@Injectable({ provideIn: 'root' })
export class SecureStorageService implements DataStorageEngine {
    constructor(@Inject(SECURE_SALT) public salt: string, private secureMd5: SecureMd5Service) {}

    public getItem(key: string): string | null {
        const value: string = sessionStorage.getItem(key) || null;
        if (value) {
            return this.secureMd5.decode(this.salt, value);
        }
        return null;
    }

    public setItem(key: string, value: string): void {
        const secureData: string = this.secureMd5.encode(this.salt, value);
        sessionStorage.setItem(key, secureData);
    }

    // ...
}
```
