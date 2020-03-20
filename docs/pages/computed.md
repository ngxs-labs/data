## (@)computed

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
    @computed()
    public get total(): number {
        return this.snapshot.price * this.snapshot.amount;
    }
}
```

Computed values are automatically derived from your state if current state value that affects them changes. Computed
values can be optimized away in many cases by NGXS as they are assumed to be pure. For example, a computed property
won't re-run if none of the data used in the previous computation changed.
