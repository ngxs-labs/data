## State repository

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

#### Create your custom repository class

```ts
export class MyEntityRepository<T> implements DataRepository<T> {
    // ..
    public set(..): void { ... }
    public add(..): void { ... }
    public update(..): void { ... }
    public delete(..): void { ... }
    public upsert(..): void { ... }
    public upsertMany(..): void { ... }

    // Also you can override

    @action()
    public reset(): void {
      // my logic
    }

}

@StateRepository()
@State({
    name: 'myEntityState',
    defaults: { ... }
})
@Injectable()
export class MyEntityState extends MyEntityRepository<AppModel> {}
```
