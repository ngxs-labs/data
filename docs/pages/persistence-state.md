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

-   `existingEngine` (required|optional, `DataStorage|Storage`) - Specify an object that conforms to the Storage
    interface to use, this will default to localStorage.

-   `useClass` (required|optional, `Type<T>`) - If no `existingEngine` is specified, you can provide by class token your
    storage container.

-   `path` (optional, `string`) - Path for slice data from NGXS store, this will default path to current state in store.

-   `version` (optional, `number`) - You can migrate data from one version to another during the startup of the store,
    this will default first version.

-   `ttl` (optional, `number`) - You can determine the lifetime of a given key (default: -1, disable).

-   `ttlDelay` (optional, `number`) - The time, in milliseconds (thousandths of a second), the timer should delay in
    between checking for expiration time live (default: 60000ms / 1min).

-   `ttlExpiredStrategy` (optional, `TTL_EXPIRED_STRATEGY`) - You can determine what to do with the key if it expires
    (default: TTL_EXPIRED_STRATEGY.REMOVE_KEY_AFTER_EXPIRED).

-   `fireInit` (optional, `boolean`) - Disable initial synchronized with the storage after occurred rehydrate from
    storage (by always default will be synchronized).

-   `nullable` (optional, `boolean`) - If the state is undefined or null in the storage by key, then it will overwrite
    the default state when initial prepared.

-   `rehydrate` (optional, `boolean`) - Pull initial state from storage on a startup (true by default).

-   `migrate` (optional, `defaults: T, storage: R) => T`) - Function that accepts a state and expects the new state in
    return.

-   `skipMigrate` (optional, `boolean`) - Skip key migration (default: false).

-   `decode` (optional, `STORAGE_DECODE_TYPE`) - You can also decode or encode your data in base64 (default: none).

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

### Time to live (TTL)

```ts
interface AuthJwtModel {
    accessToken: string | null;
    refreshToken: string | null;
}

@Persistence({
    path: 'auth.accessToken',
    existingEngine: localStorage,
    ttl: 1000 * 60 * 15 // 15min
})
@StateRepository()
@State<AuthJwtModel>({
    name: 'auth',
    defaults: {
        accessToken: null,
        refreshToken: null
    }
})
@Injectable()
export class AuthJwtState extends NgxsDataRepository<AuthJwtModel> implements NgxsDataAfterExpired {
    public expired$: Subject<NgxsDataExpiredEvent> = new Subject();

    constructor(private readonly snackBar: MatSnackBar, private readonly auth: AuthService) {
        super();
    }

    public ngxsDataAfterExpired(event: NgxsDataExpiredEvent, _provider: PersistenceProvider): void {
        this.auth.refreshAccessToken();
        this.snackBar.open('Expired', event.key, {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
        });
    }
}
```

![](https://habrastorage.org/webt/xk/_h/wq/xk_hwqvh6testmou6b6vtjzdekm.png)

### Migration strategy

```ts
// mock for example
localStorage.setItem(
    '@ngxs.store.migrate',
    JSON.stringify({
        lastChanged: '2020-01-01T12:10:00.000Z',
        version: 1,
        data: {
            cachedIds: [1, 2, 3],
            myValues: ['123', '5125', '255']
        }
    })
);

// state with migration strategy
@Persistence({
    version: 2,
    existingEngine: localStorage
})
@StateRepository()
@State<NewModel>({
    name: 'migrate',
    defaults: {
        ids: [5, 7],
        values: ['63']
    }
})
@Injectable()
class MigrateV1toV2State extends NgxsDataRepository<NewModel> implements NgxsDataMigrateStorage {
    public ngxsDataStorageMigrate(defaults: NewModel, storage: OldModel): NewModel {
        return {
            ids: [...defaults.ids, ...storage.cachedIds],
            values: [...defaults.values, ...storage.myValues]
        };
    }
}

state.getState();

// { ids: [ 5, 7, 1, 2, 3 ], values: [ '63', '123', '5125', '255' ] }
```

#### Multiples providers

However, a situation may arise when you need to migrate different data sources. Suppose you had different models for a
nested state:

```ts
sessionStorage.setItem(
    '@ngxs.store.deepFilter.myFilter',
    JSON.stringify({
        lastChanged: '2020-01-01T12:10:00.000Z',
        version: 1,
        data: { phoneValue: '8911-111-1111' }
    })
);

localStorage.setItem(
    '@ngxs.store.deepFilter.options',
    JSON.stringify({
        lastChanged: '2020-01-01T12:10:00.000Z',
        version: 1,
        data: { size: 10, number: 2 }
    })
);
```

And the new model now looks like this:

```ts
export interface MyFilter {
    phone: string | null;
    cardNumber: string | null;
}

export interface MyOptions {
    pageSize: number | null;
    pageNumber: number | null;
}

export interface NewModel {
    myFilter: MyFilter;
    options: MyOptions;
}
```

In this case, you can define a handler for each:

```ts
@Persistence([
    {
        version: 2,
        path: 'deepFilter.myFilter',
        existingEngine: sessionStorage,
        migrate: (defaults: MyFilter, storage: { phoneValue: string }): MyFilter => ({
            ...defaults,
            phone: storage.phoneValue
        })
    },
    {
        version: 2,
        path: 'deepFilter.options',
        existingEngine: localStorage,
        migrate: (defaults: MyOptions, storage: { size: number; number: number }): MyOptions => ({
            ...defaults,
            pageSize: storage.size,
            pageNumber: storage.number
        })
    }
])
@StateRepository()
@State<NewModel>({
    name: 'deepFilter',
    defaults: {
        myFilter: {
            phone: null,
            cardNumber: null
        },
        options: {
            pageNumber: null,
            pageSize: null
        }
    }
})
@Injectable()
class DeepFilterState extends NgxsDataRepository<NewModel> {}

// state.getState()
/*

 {
    myFilter: { phone: '8911-111-1111', cardNumber: null },
    options: { pageNumber: 2, pageSize: 10 }
 }

*/
```

Also, if you want skipping migration for another provider, you can set `skipMigrate` to `true`.

### Storage events

The storage event of the Window interface fires when a storage area (localStorage or sessionStorage) has been modified
in the context of another document.

```ts
@Persistence()
@StateRepository()
@State({
    name: 'count',
    defaults: 0
})
@Injectable()
class CountState extends NgxsDataRepository<number> implements NgxsDataAfterStorageEvent {
    public ngxsDataAfterStorageEvent(event: NgxsDataStorageEvent) {
        console.log(event);
        // my logic
    }
}
```

```ts
// emulate storage event

localStorage.setItem(
    '@ngxs.store.count',
    JSON.stringify({ lastChanged: '2020-01-01T12:10:00.000Z', version: 1, data: 15 })
);

window.dispatchEvent(
    new StorageEvent('storage', {
        key: '@ngxs.store.count'
    })
);
```

When an event occurs, you will receive a new state, also, if you implemented a `ngxsDataAfterStorageEvent` method, it
will be called.

### Decode/encode

```ts
@Persistence({
    existingEngine: localStorage,
    decode: STORAGE_DECODE_TYPE.BASE64
})
@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsDataRepository<string[]> {}
```

![](https://habrastorage.org/webt/zq/iu/yk/zqiuyk0htv0swwa_b5ji45vuahe.png)

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

### Use base64 for decode/encode data in storage by default everything

```ts
import { STORAGE_DECODE_TYPE } from '@ngxs-labs/data/typings';
import { NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN, NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';

@NgModule({
    imports: [NgxsModule.forRoot([AppState]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)],
    providers: [{ provide: NGXS_DATA_STORAGE_DECODE_TYPE_TOKEN, useValue: STORAGE_DECODE_TYPE.BASE64 }]
})
export class AppModule {}
```

### Nested states

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
