## (@)Persistence

```ts
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';

@NgModule({
    // ..
    imports: [NgxsModule.forRoot([TodoState]), NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN])]
})
export class AppModule {}
```

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

`@Persistence()` - If you add a current decorator without options, then the `todo` state will synchronize with
LocalStorage by default.

![](https://habrastorage.org/webt/p_/ur/jw/p_urjwost3fn2n-ogpduwjnz8zo.png)

### API

`@Persistence(options?: PersistenceProvider[] | PersistenceProvider)`

---

##### PersistenceProvider

-   `existingEngine` (required|optional) - Specify an object that conforms to the Storage interface to use, this will
    default to localStorage.

-   `useClass` (required|optional) - If no `existingEngine` is specified, you can provide by class token your storage
    container.

-   `path` (optional) - Path for slice data from NGXS store, this will default path to current state in store.

-   `version` (optional) - You can migrate data from one version to another during the startup of the store, this will
    default first version.

-   `ttl` (optional) - You can determine the lifetime of a given key.

-   `fireInit` (optional) - Disable initial synchronized with the storage after occurred rehydrate from storage (by
    always default will be synchronized).

-   `nullable` (optional) - If the state is undefined or null in the storage by key, then it will overwrite the default
    state when initial prepared.

-   `rehydrate` (optional) - Pull initial state from storage on a startup (true by default).

### Fire init

If you don't want your value that was received from the storage to be synchronized again with the storage, you can
disable this step. You will see that lastChanged is not updated again and again when the page reloads.

```ts
@Persistence({
    fireInit: false,
    existingEngine: localStorage
})
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

![](https://habrastorage.org/webt/cb/6i/6e/cb6i6eps4lizxl2nfkaqamzcosk.png)

### Override global prefix key

By default, key search uses the prefix `@ngxs.store.`, but you can override the prefix:

```ts
import { NGXS_DATA_STORAGE_PREFIX_TOKEN, NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';

@NgModule({
    imports: [NgxsModule.forRoot([AppState]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)],
    providers: [{ provide: NGXS_DATA_STORAGE_PREFIX_TOKEN, useValue: '@myCompany.store.' }]
})
export class AppModule {}
```

### More options

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

@Persistence({
    path: 'count.deepCount.val', // path to slice
    existingEngine: sessionStorage, // storage instance
    prefixKey: '@mycompany.store.', // custom prefix
    ttl: 60 * 60 * 24 * 1000 // 24 hour for time to live
})
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

### Global custom storage

```ts
import { DataStorage } from '@ngxs-labs/data/typings';

class MyGlobalStorage implements DataStorage {
    // ..
}

@Persistence({
    existingEngine: new MyGlobalStorage()
})
@StateRepository()
@State({
    name: 'count',
    defaults: { val: 100 }
})
@Injectable()
class MyState {}
```

#### Injectable Storage

```ts
@Persistance({
    useClass: SecureStorageService
})
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
import { DataStorage } from '@ngxs-labs/data/typings';

@Injectable({ provideIn: 'root' })
export class SecureStorageService implements DataStorage {
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

### Options

![](https://habrastorage.org/webt/kk/gk/lb/kkgklbnwopcbsifj78x4muwvxyk.png)

### Not recommended

```ts
@Persistence([
    {
        path: 'customerFilter.cardNumber',
        existingEngine: sessionStorage
    },
    {
        path: 'customerFilter.sibelId',
        existingEngine: sessionStorage
    },
    {
        path: 'customerFilter',
        // conflict with child properties -> cardNumber and sibelId fields can't sync from sessionStorage
        // because override every time from localStorage data
        existingEngine: localStorage
    }
])
@StateRepository()
@State({
    name: 'customerFilter',
    defaults: {
        cardNumber: null,
        sibelId: null
    }
})
@Injectable()
export class CustomerFilterState extends NgxsDataRepository<CustomerFilterModel> {}
```
