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

The main purpose of this extension is to provide the necessary layer of abstraction for states. Automates the creation
of actions, dispatchers, and selectors for each entity type.

Benefits:

-   No breaking changes (support NGXS 3.6+)
-   Angular-way (service abstraction)
-   Immutable state context out-of-the-box
-   Persistence state out-of-the-box
-   Automatic action naming by service methods
-   Improved debugging (`@payload` by arguments)
-   Automatic type inference for selection
-   Support debounce for throttling dispatch
-   Easy testable states

## Table of contents:

1. [📖 Changelog](https://github.com/ngxs-labs/data/blob/master/CHANGELOG.md)
2. [🚀 Quick Start](#quick-start)
3. [📦 Advanced](#advanced)

    - [Repository](#state-repository)
    - [Action](#action)
    - [Persistence](#persistence-state)

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

![](https://habrastorage.org/webt/hg/gz/92/hggz92co_9mvmk8rfqkxfud0bq8.png)

![](https://habrastorage.org/webt/60/7v/ja/607vja_6rkbxsnlfidusmv3263u.png)

## Advanced

Here the main description of the functionality of this plugin will be collected.

### State repository

`@StateRepository` - This is a decorator that provides an extension of the functionality of NGXS states, thanks to which
you get access to the internal mechanism of the NGXS.

```ts
@StateRepository()
@State({
    name: 'app',
    defaults: {}
})
@Injectable()
export class AppState extends NgxsDataRepository<AppModel> {}
```

For correct behavior you always need to inherited from an abstract NgxsDataRepository class. The basic NGXS methods are
defined in the `DataRepository<T>` interface:

```ts
export type StateValue<T> = T | Immutable<T> | ((state: Immutable<T>) => Immutable<T> | T);

export interface DataRepository<T> {
    name: string;
    initialState: Immutable<T>;
    state$: Observable<Immutable<T>>;

    getState(): Immutable<T>;

    dispatch(actions: ActionType | ActionType[]): Observable<void>;

    patchState(val: Partial<T | Immutable<T>>): void;

    setState(stateValue: StateValue<T>): void;

    reset(): void;
}
```

### Action

`@action` - This decorator emulates the execution of asynchronous or synchronous actions. Actions can either be thought
of as a command which should trigger something to happen.

#### Before (origin NGXS behavior)

```ts
export class AddTodo {
    public static type = '[Add todo]';
    constructor(public payload: string) {}
}

@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsDataRepository<string[]> {
    @Action(AddTodo)
    public add({ setState }: StateContext<string[]>, { payload }: AddTodo): void {
        setState((state) => state.concat(payload));
    }
}
```

```ts
@Component({
    selector: 'app',
    template: `
        <input #inputElement />
        <button (click)="addTodo(inputElement.value)">Add todo</button>
    `
})
class AppComponent {
    constructor(private store: Store) {}

    public addTodo(value: string): void {
        this.store.dispatch(new AddTodo(value));
    }
}
```

#### After (Data-plugin behavior)

```ts
@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsDataRepository<string[]> {
    @action()
    public add(todo: string): void {
        this.ctx.setState((state) => state.concat(todo));
    }
}
```

```ts
@Component({
    selector: 'app',
    template: `
        <input #inputElement />
        <button (click)="todo.add(inputElement.value)">Add todo</button>
    `
})
class AppComponent {
    constructor(private todo: TodoState) {}
}
```

The method `todo.add(payload)` is the same as `store.dispatch({ type: '@todo.add', todo: payload })`.

What are the benefits?

-   No need to create action classes
-   Typing improvements for state context
-   Explicit interaction with states

### Persistence state

```ts
@Persistence()
@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsDataRepository<string[]> {
    // ..
}
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
        path: 'count.deepCount.val', // path to slice
        existingEngine: sessionStorage, // storage instance
        prefixKey: '@mycompany.store.', // custom prefix
        ttl: 60 * 60 * 24 * 1000 // 24 hour for time to live
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

#### Custom Storage

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
