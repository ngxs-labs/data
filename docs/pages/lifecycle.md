## Lifecycle sequence

After creating the state by calling its constructor, NGXS calls the lifecycle hook methods in the following sequence at
specific moments:

| Hook                 | Purpose and Timing                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| ngxsOnChanges()      | Called _before_ `ngxsOnInit()` and whenever state changes.                                                |
| ngxsOnInit()         | Called _once_, after the _first_ `ngxsOnChanges()` and _before_ the `APP_INITIALIZER` token is resolved.  |
| ngxsAfterBootstrap() | Called _once_, after the root view and all its children have been rendered.                               |
| ngxsDataDoCheck()    | Called _after_ `ngxsAfterBootstrap()` and called every time a state is reinitialized after a state reset. |
| ngxsDataAfterReset() | Called every time _after_ `reset()`                                                                       |

### `ngxsDataDoCheck` and `ngxsDataAfterReset`

```ts
@StateRepository()
@State<Customer[]>({
    name: 'customers',
    defaults: []
})
@Injectable()
class CustomersStates extends NgxsDataRepository<Customer[]> implements NgxsDataDoCheck, NgxsDataAfterReset {
    private subscription: Subscription;

    constructor(private customer: CustomerService) {
        super();
    }

    /**
     * @description:
     * This method guarantees that it will be called after the application is rendered
     * and all services of the Angular are loaded, so you can subscribe to the necessary
     * data streams (any observables) in this method and unsubscribe later in the method `ngxsDataAfterReset`
     */
    public ngxsDataDoCheck(): void {
        console.log(this.isInitialised); // true
        console.log(this.isBootstrapped); // true
        this.subscription = this.customer.events.subscribe((e) => console.log(e));
    }

    public ngxsDataAfterReset(): void {
        this.subscription?.unsubscribe();
    }
}
```

### `ngxsOnChanges`, `ngxsOnInit` and `ngxsAfterBootstrap`

```ts
@StateRepository()
@State({
    name: 'counter',
    defaults: 0
})
@Injectable()
class CounterState extends NgxsDataRepository<number> implements NgxsOnChanges, NgxsOnInit, NgxsAfterBootstrap {
    public ngxsOnChanges(): void {
        super.ngxsOnChanges(); // be sure to call the parent method
        // your logic
    }

    public ngxsOnInit(): void {
        super.ngxsOnInit(); // be sure to call the parent method
        // your logic
    }

    public ngxsAfterBootstrap(): void {
        super.ngxsAfterBootstrap(); // be sure to call the parent method
        // your logic
    }
}
```
