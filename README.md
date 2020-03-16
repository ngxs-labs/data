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

-   Angular-way (State as a Service)
-   Improved debugging (`@payload` decorator)
-   Persistence state out-of-the-box (`@Persistence` decorator)
-   Automatic action naming by service methods (`@action, @named` decorator)
-   Immutable state context out-of-the-box (`NgxsImmutableDataRepository`)
-   Support debounce for throttling dispatch (`@debounce` decorator)
-   Automatic type inference for selection
-   Easy testable states

Minimal peer dependencies:

-   Require minimal `@ngxs/store v3.6.2`
-   Require minimal `TypeScript v3.7.2`

If you are using Angular 8, you can write in the `tsconfig.json`:

```json
{
    "angularCompilerOptions": {
        "disableTypeScriptVersionCheck": true
    },
    "compilerOptions": {}
}
```

### Quick Links

-   ✨ Learn about it on the [docs](./docs/README.md)
-   🚀 See it in action on [Stackblitz](https://stackblitz.io/github/ngxs-labs/data)
-   😎 Checkout the [sample application](./integration)
-   📝 Learn about updates from the [changelog](CHANGELOG.md)

### Simple example

**Before**

`counter.state.ts`

```ts
import { State, Action, StateContext } from '@ngxs/store';

export class Increment {
    static readonly type = '[Counter] Increment';
}

export class Decrement {
    static readonly type = '[Counter] Decrement';
}

@State<number>({
    name: 'counter',
    defaults: 0
})
export class CounterState {
    @Action(Increment)
    increment(ctx: StateContext<number>) {
        ctx.setState(ctx.getState() + 1);
    }

    @Action(Decrement)
    decrement(ctx: StateContext<number>) {
        ctx.setState(ctx.getState() - 1);
    }
}
```

`app.component.ts`

```ts
import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { CounterState, Increment, Decrement } from './counter.state';

@Component({
    selector: 'app-root',
    template: `
        <ng-container *ngIf="counter$ | async as counter">
            <h1>{{ counter }}</h1>
        </ng-container>

        <button (click)="increment()">Increment</button>
        <button (click)="decrement()">Decrement</button>
    `
})
export class AppComponent {
    @Select(CounterState) counter$: Observable<number>;
    constructor(private store: Store) {}

    increment() {
        this.store.dispatch(new Increment());
    }

    decrement() {
        this.store.dispatch(new Decrement());
    }
}
```

**After**

`counter.state.ts`

```ts
import { State } from '@ngxs/store';
import { action, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';

@StateRepository()
@State<number>({
    name: 'counter',
    defaults: 0
})
@Injectable()
export class CounterState extends NgxsDataRepository<number> {
    @action() increment() {
        this.ctx.setState((state) => ++state);
    }

    @action() decrement() {
        this.ctx.setState((state) => --state);
    }
}
```

`app.component.ts`

```ts
import { Component } from '@angular/core';

import { CounterState } from './counter.state';

@Component({
    selector: 'app-root',
    template: `
        <ng-container *ngIf="counter.state$ | async as counter">
            <h1>{{ counter }}</h1>
        </ng-container>

        <button (click)="counter.increment()">Increment</button>
        <button (click)="counter.decrement()">Decrement</button>
    `
})
export class AppComponent {
    constructor(counter: CounterState) {}
}
```
