## (@)Computed

Computed values are values that can be derived from the existing state or other computed values. Conceptually, they are
very similar to formulas in spreadsheets. Computed values can't be underestimated, as they help you to make your actual
modifiable state as small as possible. Besides that they are highly optimized, so use them wherever possible.

```ts
@StateRepository()
@State<OrderLineModel>({
    name: 'orderLine',
    defaults: {
        price: 0,
        amount: 1
    }
})
@Injectable()
class OrderLineState extends NgxsDataRepository<OrderLineModel> {
    @Computed()
    public get total(): number {
        return this.snapshot.price * this.snapshot.amount;
    }
}
```

Computed values are automatically derived from your state if current state value that affects them changes. Computed
values can be optimized away in many cases by NGXS as they are assumed to be pure. For example, a computed property
won't re-run if none of the data used in the previous computation changed.

### Using values from other states

```ts
@StateRepository()
@State({
    name: 'price',
    defaults: 10
})
@Injectable()
class PriceState extends NgxsDataRepository<number> {
    public setPrice(value: string): void {
        this.setState(parseFloat(value));
    }
}

@StateRepository()
@State({
    name: 'amount',
    defaults: 20
})
@Injectable()
class AmountState extends NgxsDataRepository<number> {
    constructor(private readonly price: PriceState) {
        super();
    }

    @Computed()
    public get sum(): number {
        return this.snapshot + this.price.snapshot;
    }

    public setAmount(value: string): void {
        this.setState(parseFloat(value));
    }
}

@Component({
    selector: 'app',
    template: `
        <input placeholder="Price" [ngModel]="price.snapshot" (ngModelChange)="price.setPrice($event)" /> <br />
        <input placeholder="Amount" [ngModel]="amount.snapshot" (ngModelChange)="amount.setAmount($event)" />
        <p>Sum: {{ amount.sum }}</p>
    `
})
class AppComponent {
    constructor(public price: PriceState, public amount: AmountState) {}
}
```

![](https://habrastorage.org/webt/-k/aq/uj/-kaquj5ghj3hmx3aup7mym4xeya.png)

#### Now `Selector` and `Select` utilities are not needed, you can do it right in the state

```ts
@StateRepository()
@State<string[]>({
    name: 'animals',
    defaults: ['panda', 'horse', 'bee']
})
@Injectable()
export class ZooState extends NgxsDataRepository<string[]> {
    @Computed()
    public get pandas(): string[] {
        return this.snapshot.filter((animal) => animal === 'panda');
    }

    @Computed()
    public get horses(): string[] {
        return this.snapshot.filter((animal) => animal === 'horse');
    }

    @Computed()
    public get bees(): string[] {
        return this.snapshot.filter((animal) => animal === 'bee');
    }
}
```

### Meta selectors

By default selectors in NGXS are bound to a state. Sometimes you need the ability to join to un-related states in a
high-performance re-usable fashion. A meta selector is a selector allows you to bind N number of selectors together to
return a state stream. Let's say we have 2 states; 'zoos' and 'theme parks'. We have a component that needs to show all
the zoos and theme parks for a given city. These are two very distinct state classes that are likely not related in any
manner. We can use a meta selector to join these two states together like:

```ts
@StateRepository()
@State({ name: 'zoo', defaults: [] })
export class ZooState extends NgxsDataRepository<string[]> {}

@StateRepository()
@State({ name: 'themePark', defaults: [] })
export class ThemeParkState extends NgxsDataRepository<string[]> {}

@StateRepository()
@State({ name: 'city', defaults: [] })
export class CityState extends NgxsDataRepository<string[]> {
    constructor(private zoo: ZooState, private themePark: ThemeParkState) {
        super();
    }

    @Computed()
    public get zooThemeParks(): Observable<string[]> {
        return combineLatest([this.zoo.state$, this.themePark.state$]).pipe(
            map(([zoo, themeParks]) => [...zoo, ...themeParks])
        );
    }
}
```

Unlike NGXS native meta selectors, now you get a well typings by infer types when use combined selectors.

##### forkJoin vs combineLatest

`forkJoin` - When all observables complete, emit the last emitted value from each.

`combineLatest` - When any observable emits a value, emit the latest value from each.

Usage is pretty similar, but you shouldn't forget to unsubscribe from combineLatest unlike forkJoin.

### Side effects (non observables)

If you use any unknown value inside computed fields then they are not tracked:

```ts
@Injectable()
class MyFirstCountService {
    private values$: BehaviorSubject<number> = new BehaviorSubject(0);

    public increment(): void {
        this.values$.next(this.getValue() + 1);
    }

    public getValue(): number {
        return this.values$.getValue();
    }
}

@StateRepository()
@State({
    name: 'count',
    defaults: 0
})
@Injectable()
class MySecondCountState extends NgxsDataRepository<number> {
    constructor(private readonly first: MyFirstCountService) {
        super();
    }

    @Computed()
    public get sum(): number {
        return this.snapshot + this.first.getValue();
    }

    @DataAction()
    public increment(): void {
        this.ctx.setState((state: number) => ++state);
    }
}

@Component({
    selector: 'app',
    template: `
        <button (click)="firstCount.increment()">Increment firstCount</button> <br />
        <button (click)="secondCount.increment()">Increment secondCount</button>

        <p>Sum: {{ secondCount.sum }}</p>
    `
})
class AppComponent {
    constructor(public firstCount: MyFirstCountService, public secondCount: MySecondCountState) {}
}
```

When you click the `"Increment firstCount"` button, you will see that the `sum` is not recalculated. Why? Everything is
very simple, caching occurs when any of the states has not changed and the result is still returned from the cache. In
order to help recalculate the value again, if you need it, you will need to manually update the cache:

```ts
@Injectable()
class MyFirstCountService {
    private values$: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor(private readonly sequence: NgxsDataSequence) {}

    public increment(): void {
        this.values$.next(this.getValue() + 1);
        this.sequence.updateSequence();
    }

    public getValue(): number {
        this.values$.getValue();
    }
}
```

`sequence.updateSequence()` - This is necessary if you know that your states use values from third-party services, and
not the NGXS states in computed fields.
