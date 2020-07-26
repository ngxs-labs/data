## Immutability

JavaScript defines two overarching groups of data types:

-   `Primitives`: low-level values that are immutable (e.g. strings, numbers, booleans etc.)
-   `References`: collections of properties, representing identifiable heap memory, that are mutable (e.g. objects,
    arrays, Map etc.)

#### Mutable References

Let’s contrast the behavior of primitives with references. Let’s declare an object with a couple of properties:

```ts
const me = {
    name: 'James',
    age: 29
};
```

Given that JavaScript objects are mutable, we can change its existing properties and add new ones:

```ts
me.name = 'Rob';
me.isTall = true;

console.log(me); // Object { name: "Rob", age: 29, isTall: true };
```

Unlike primitives, objects can be directly mutated without being replaced by a new reference. We can prove this by
sharing a single object across two declarations:

```ts
const me = {
    name: 'James',
    age: 29
};

const rob = me;

rob.name = 'Rob';

console.log(me); // { name: 'Rob', age: 29 }
```

#### NGXS provides pseudo-immutable Objects.

If you want to freeze an entire object hierarchy then this requires a traversal of the object tree and for the
Object.freeze operation to be applied to all objects. This is commonly known as deep freezing. When the developmentMode
option is enabled in the NGXS forRoot module configuration a
[deep freeze](https://github.com/ngxs/store/blob/1a85af3ec36b669bb7491332cf62fc6db202e955/packages/store/src/internal/state-operations.ts#L46)
operation is applied to any new objects in the state tree to help prevent side effects. Since this imposes some
performance costs it is only enabled in development mode.

#### Immutable Type

`Immutable` - There are no built-in utility types to handle deep immutability, but given that TypeScript introduces
better support for recursive types by deferring their resolution, we can now express an infinitely recursive type to
denote properties as readonly across the entire depth of an object.

#### What are the benefits?

```ts
@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsImmutableDataRepository<string[]> {
    reversed$ = this.state$.pipe(
        map( state => state.reverse() )
    );                     ^
                           |
                           |_____ TS Compile error: property 'reverse' does not exist on type
}
```

Thus, the developer will not be able to make his own mistake. If he will mutate the state directly or use mutational
methods. If you need to use states for set input property:

```ts
import { Immutable } from '@angular-ru/common/typings';

@Component({ .. })
class TodoComponent {
    @Input() public data: Immutable<string[]>;
}

@Component({
    selector: 'app',
    template: '<todo [data]="todos.state$ | async"></todo>'
})
class AppComponent {
    constructor(public todos: TodosState) {}
}
```

#### Casting to mutable

However, if you really need to cast to mutable, you can do this in several ways:

`Into state`:

```ts
@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsImmutableDataRepository<string[]> {
    mutableState$ = this.state$.pipe(
        map( state => state as string[] )
    );
```

or `Into template` without creating `mutableState$`:

```ts
import { NgxsDataUtilsModule } from '@ngxs-labs/data/utils';

@NgModule({
    imports: [
        // ..
        NgxsDataUtilsModule
    ]
})
export class AppModuleOrMyLazyModule {}
```

```ts
@Component({ .. })
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

### State operators

To use state operators, you must specify the exact return type:

```ts
this.ctx.setState(
    patch<Immutable<TodoStateModel>>({
        todos: updateItem<Todo>(index, patch({ completed: (value) => !value }))
    })
);
```
