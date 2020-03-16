## Persistence state

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
export class TodoState extends NgxsImmutableDataRepository<string[]> {
    // ..
}
```

`@Persistence()` - If you add current decorator without options, then the `todo` state will synchronize with
LocalStorage by default.

![](https://habrastorage.org/webt/p_/ur/jw/p_urjwost3fn2n-ogpduwjnz8zo.png)

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
export class CountState extends NgxsImmutableDataRepository<CountModel> {}
```

### Global custom storage

```ts
import { DataStorage } from '@ngxs-labs/data/typings';
import { NGXS_DATA_STORAGE_PREFIX_TOKEN, NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';

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
export class SecureState extends NgxsImmutableDataRepository<SecureModel> {}
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

```ts
interface CommonPersistenceProvider {
    /**
     * Path for slice
     * default: state.name
     */
    path?: string;
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
