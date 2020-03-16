# To become 3.0.0

-   Feature: expose `NgxsDataRepository<T>` for working with classic mutable data
-   Feature: expose `NgxsImmutableDataRepository<T>` for working with immutable data
-   Feature: expose `@payload` decorator for register payload in action
-   Feature: expose `@named` decorator for register name in action
-   Feature: expose `@debounce` decorator for throttling dispatch actions
-   Feature: add extension API for NGXS Data plugin
-   Feature: expose storage extension as plugin
-   Feature: improved `@Persistence` decorator for stability
-   Fix: correct inheritance of state classes
-   Fix: compatibility with `@ngxs/store@3.6.2`
-   Fix: correct value freeze from `getState()`
-   Fix: memory leak in storage extension
-   Fix: can now global override prefix key without `@Persistence` decorator

### BREAKING CHANGES &#57351;

-   Removed `@query` decorator
-   Now require minimal `@ngxs/store v3.6.2`
-   Now require minimal `TypeScript v3.7.2`
-   Other breaking changes:

If you are using Angular 8, you can write in the `tsconfig.json`:

```json
{
    "angularCompilerOptions": {
        "disableTypeScriptVersionCheck": true
    },
    "compilerOptions": {}
}
```

-   Now you need to explicitly set the payload:

```ts
// BEFORE

@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsImmutableDataRepository<string[]> {
    @action()
    public addTodo(todo: string): void {
        if (todo) {
            this.ctx.setState((state) => state.concat(todo));
        }
    }
}

// AFTER

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
            this.ctx.setState((state) => state.concat(todo));
        }
    }
}
```

-   The `type, async, debounce` action options are not longer support, also now it is necessary to use the `payload`
    decorator for logging send value:

```ts
// BEFORE

@StateRepository()
@State({
    name: 'app',
    default: ''
})
@Injectable()
class AppState extends NgxsImmutableDataRepository<string> {
    @action({ async: true, debounce: 300 })
    public concat(text: string): void {
        this.setState((state) => `${state}${text}`);
    }
}

// AFTER

@StateRepository()
@State({
    name: 'app',
    default: ''
})
@Injectable()
class AppState extends NgxsImmutableDataRepository<string> {
    @debounce()
    @action()
    public concat(@payload('text') text: string): void {
        this.setState((state) => `${state}${text}`);
    }
}
```

-   Moved common interfaces to `@ngxs-labs/data/typings`:

```ts
import { Immutable, Mutable } from '@ngxs-labs/data/typings';
```

-   For a cast state to mutable type it is necessary to use package `@ngxs-labs/data/utils`:

```ts
import { NgxsDataUtilsModule } from '@ngxs-labs/data/utils';

@NgModule({
    imports: [
        // ..
        NgxsDataUtilsModule
    ]
})
export class AppModule {}

@Component({
    //..
})
class TodoComponent {
    @Input() public data: string[];
}

@Component({
    selector: 'app',
    template: '<todo [data]="todos.state$ | async | mutable"></todo>'
})
class AppComponent {
    constructor(public todos: TodosState) {}
}
```

-   For start work with storage plugin you need provide `storage extension`:

```ts
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NGXS_DATA_STORAGE_CONTAINER, NGXS_DATA_STORAGE_EXTENSION } from '@ngxs-labs/data/storage';

@NgModule({
    // ..
    imports: [
        NgxsModule.forRoot([AppState], { developmentMode: !environment.production }),
        NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_EXTENSION, NGXS_DATA_STORAGE_CONTAINER])
    ]
})
export class AppModule {}
```

-   All decorators are now exported from a subpackage:

```ts
import { action, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
```

-   All repositories are now exported from a subpackage:

```ts
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
```

# 2.4.1 2020-01-07

-   Fix: preserve mutate `getState()` when run angular dev mode

# 2.4.0 2020-01-07

-   Feature: add freeze state when run angular dev mode for selection stream

# 2.3.0 2020-01-07

-   Feature: expose `mutable` pipe for casting immutable stream to mutable stream

# 2.2.6 2019-12-29

-   Fix: corrected reset with children states

# 2.2.5 2019-12-26

-   Fix: corrected automatic type inference in ctx.setState

# 2.2.4 2019-12-25

-   Fix: disable automatic subscription of observables inside the action method

# 2.2.3 2019-12-24

-   Fix: remove duplicate field in DataStorageEngine
-   Fix: remove infinite loop when triggered onstorage event

# 2.2.0 2019-12-21

-   Feature: enable strict typings
-   Fix: downgrade typescript for compatibility angular build

# 2.1.0 2019-12-19

-   Feature: storage plugin `out of the box`
-   Fix: dispatch storage when first initial states

# 2.0.0 2019-12-11

-   Feature: Support TypeScript 3.7
-   Feature: Support NGXS 3.6

### BREAKING CHANGES

-   Compatible only with NGXS 3.6+
-   Now `patchState, setState` return `void`
-   No longer support options in `NgxsDataPluginModule.forRoot()`
-   No longer support `@query` decorator
