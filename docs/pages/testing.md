## Unit Testing

Unit testing is easy with NGXS and NGXS Data plugin. A basic test looks like this:

```ts
describe('AppState', () => {
    @StateRepository()
    @State({
        name: 'app',
        defaults: 'hello world'
    })
    @Injectable()
    class AppState extends NgxsDataRepository<string> {}

    it(
        'should be correct ensure state from AppState',
        ngxsTestingPlatform([AppState], (store: Store, app: AppState) => {
            expect(store.snapshot()).toEqual({ app: 'hello world' });
            expect(app.getState()).toEqual('hello world');
        })
    );
});
```

`ngxsTestingPlatform` - This is an testing platform that allows you to fully test the entire lifecycle of NGXS methods.

#### Example where we testing NGXS Lifecycle

```ts
// ..

describe('[TEST]: Abstract ngxs data repository', () => {
    let event: string[] = [];

    interface Model {
        value: number;
    }

    @StateRepository()
    @State({
        name: 'a',
        defaults: { value: 1 }
    })
    class A extends NgxsDataRepository<Model> implements NgxsDataDoCheck, NgxsDataAfterReset {
        constructor() {
            super();
            event.push(`create: ${this.name}`);
        }

        public ngxsOnInit(): void {
            event.push(`ngxsOnInit: ${this.name}`);
            super.ngxsOnInit();
        }

        public ngxsOnChanges(change: NgxsSimpleChange): void {
            event.push(`ngxsOnChanges: ${this.name} -> ${JSON.stringify(change)}`);
            super.ngxsOnChanges();
        }

        public ngxsAfterBootstrap(): void {
            event.push(`ngxsAfterBootstrap: ${this.name}`);
            super.ngxsAfterBootstrap();
        }

        public ngxsDataDoCheck(): void {
            event.push(`ngxsDataDoCheck: ${this.name}`);
        }

        public ngxsDataAfterReset(): void {
            event.push(`ngxsDataAfterReset: ${this.name}`);
        }
    }

    @StateRepository()
    @State({
        name: 'b',
        defaults: { value: 1 }
    })
    @Injectable()
    class B extends NgxsImmutableDataRepository<Model> implements NgxsDataDoCheck, NgxsDataAfterReset {
        constructor() {
            super();
            event.push(`create: ${this.name}`);
        }

        public ngxsOnInit(): void {
            event.push(`ngxsOnInit: ${this.name}`);
            super.ngxsOnInit();
        }

        public ngxsOnChanges(change: NgxsSimpleChange): void {
            event.push(`ngxsOnChanges: ${this.name} -> ${JSON.stringify(change)}`);
            super.ngxsOnChanges();
        }

        public ngxsAfterBootstrap(): void {
            event.push(`ngxsAfterBootstrap: ${this.name}`);
            super.ngxsAfterBootstrap();
        }

        public ngxsDataDoCheck(): void {
            event.push(`ngxsDataDoCheck: ${this.name}`);
        }

        public ngxsDataAfterReset(): void {
            event.push(`ngxsDataAfterReset: ${this.name}`);
        }
    }

    beforeEach(() => {
        event = [];
    });

    it(
        'should be ngxs data repository',
        ngxsTestingPlatform([A], (store: Store, a: A) => {
            expect(store.snapshot()).toEqual({ a: { value: 1 } });

            expect(a.isInitialised).toEqual(true);
            expect(a.isBootstrapped).toEqual(true);

            a.state$.subscribe((e: Model) => event.push(`state(${a.name}): set value - ${e.value}`));

            expect(a.name).toEqual('a');

            a.setState({ value: 2 });
            expect(a.getState()).toEqual({ value: 2 });

            a.initialState.value = 5; // not affected
            a.reset();

            expect(a.getState()).toEqual({ value: 1 });

            a.setState({ value: 3 });
            a.setState({ value: 4 });
            a.setState({ value: 5 });

            a.reset();

            store.reset({ a: { value: 10 } });

            expect(a.getState()).toEqual({ value: 10 });

            expect(event).toEqual([
                'create: a',
                'ngxsOnChanges: a -> {"currentValue":{"value":1},"firstChange":true}',
                'ngxsOnInit: a',
                'ngxsAfterBootstrap: a',
                'ngxsDataDoCheck: a',
                'state(a): set value - 1',
                'ngxsOnChanges: a -> {"previousValue":{"value":1},"currentValue":{"value":2},"firstChange":false}',
                'state(a): set value - 2',
                'ngxsOnChanges: a -> {"previousValue":{"value":2},"currentValue":{"value":1},"firstChange":false}',
                'state(a): set value - 1',
                'ngxsDataAfterReset: a',
                'ngxsOnChanges: a -> {"previousValue":{"value":1},"currentValue":{"value":3},"firstChange":false}',
                'ngxsDataDoCheck: a',
                'state(a): set value - 3',
                'ngxsOnChanges: a -> {"previousValue":{"value":3},"currentValue":{"value":4},"firstChange":false}',
                'state(a): set value - 4',
                'ngxsOnChanges: a -> {"previousValue":{"value":4},"currentValue":{"value":5},"firstChange":false}',
                'state(a): set value - 5',
                'ngxsOnChanges: a -> {"previousValue":{"value":5},"currentValue":{"value":1},"firstChange":false}',
                'state(a): set value - 1',
                'ngxsDataAfterReset: a',
                'state(a): set value - 10'
            ]);
        })
    );

    it(
        'should be ngxs data immutable repository',
        ngxsTestingPlatform([B], (store: Store, b: B) => {
            expect(b.isInitialised).toEqual(true);
            expect(b.isBootstrapped).toEqual(true);

            b.state$.subscribe((e: Immutable<Model>) => event.push(`state(${b.name}): set value - ${e.value}`));

            expect(b.name).toEqual('b');

            b.setState({ value: 2 });
            expect(b.getState()).toEqual({ value: 2 });

            (b.initialState as Any).value = 5; // not affected
            b.reset();

            expect(b.getState()).toEqual({ value: 1 });

            b.setState({ value: 3 });
            b.setState({ value: 4 });
            b.setState({ value: 5 });

            b.reset();

            store.reset({ b: { value: 10 } });

            expect(b.getState()).toEqual({ value: 10 });

            expect(event).toEqual([
                'create: b',
                'ngxsOnChanges: b -> {"currentValue":{"value":1},"firstChange":true}',
                'ngxsOnInit: b',
                'ngxsAfterBootstrap: b',
                'ngxsDataDoCheck: b',
                'state(b): set value - 1',
                'ngxsOnChanges: b -> {"previousValue":{"value":1},"currentValue":{"value":2},"firstChange":false}',
                'state(b): set value - 2',
                'ngxsOnChanges: b -> {"previousValue":{"value":2},"currentValue":{"value":1},"firstChange":false}',
                'state(b): set value - 1',
                'ngxsDataAfterReset: b',
                'ngxsOnChanges: b -> {"previousValue":{"value":1},"currentValue":{"value":3},"firstChange":false}',
                'ngxsDataDoCheck: b',
                'state(b): set value - 3',
                'ngxsOnChanges: b -> {"previousValue":{"value":3},"currentValue":{"value":4},"firstChange":false}',
                'state(b): set value - 4',
                'ngxsOnChanges: b -> {"previousValue":{"value":4},"currentValue":{"value":5},"firstChange":false}',
                'state(b): set value - 5',
                'ngxsOnChanges: b -> {"previousValue":{"value":5},"currentValue":{"value":1},"firstChange":false}',
                'state(b): set value - 1',
                'ngxsDataAfterReset: b',
                'state(b): set value - 10'
            ]);
        })
    );
});
```
