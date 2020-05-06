## (@)StateRepository

`@StateRepository` - This is a decorator that provides an extension of the functionality of NGXS states, thanks to which
you get access to the internal mechanism of the NGXS.

By default, you can inherit from abstract classes that give you different benefits:

-   `NgxsDataRepository<T>` a standard repository class that gives you control over your state.

```ts
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { StateRepository } from '@ngxs-labs/data/decorators';

@StateRepository()
@State({
    name: 'app',
    defaults: {}
})
@Injectable()
export class AppState extends NgxsDataRepository<AppModel> {}
```

| Method/Property                                                                                 | Return type         | Description                                         |
| ----------------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------- |
| state.name                                                                                      | string              | State name                                          |
| state.initialState                                                                              | T                   | Default state value                                 |
| state.getState()                                                                                | T                   | Current state value                                 |
| state.snapshot                                                                                  | T                   | Memoized state value (getter)                       |
| state.patchState(Partial&lt;T &verbar; Immutable&lt;T&gt;)                                      | void                | Ability to update part of the state                 |
| state.setState(Immutable&lt;T> &verbar; T &verbar; (state: T) => T &verbar; Immutable&lt;T&gt;) | void                | Overwrite state                                     |
| state.reset()                                                                                   | void                | Reset state with default state value                |
| dispatch(actions: ActionType &verbar; ActionType[])                                             | void                | Standard dispatch method                            |
| state.state\$                                                                                   | Observable&lt;T&gt; | State data stream that you can subscribe to changes |

-   `NgxsImmutableDataRepository<T>` it's the descendant of the _`NgxsDataRepository`_ class, however it gives you
    completely deep immutable control over your state and prevents the code from compiling if the user tries to mutate
    something in the state. It is recommended to use it if you understand what immutability of objects is.

```ts
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { StateRepository } from '@ngxs-labs/data/decorators';

@StateRepository()
@State({
    name: 'app',
    defaults: {}
})
@Injectable()
export class AppState extends NgxsImmutableDataRepository<AppModel> {}
```

| Method/Property                                                                                       | Return type                          | Description                                         |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------- |
| state.name                                                                                            | string                               | State name                                          |
| state.initialState                                                                                    | Immutable&lt;T&gt;                   | Default state value                                 |
| state.getState()                                                                                      | Immutable&lt;T&gt;                   | Current state value                                 |
| state.snapshot                                                                                        | Immutable&lt;T&gt;                   | Memoized state value (getter)                       |
| state.patchState(Partial&lt;T &verbar; Immutable&lt;T&gt;)                                            | void                                 | Ability to update part of the state                 |
| state.setState(Immutable&lt;T> &verbar; T &verbar; (state: Immutable&lt;T&gt;) => Immutable&lt;T&gt;) | void                                 | Overwrite state                                     |
| state.reset()                                                                                         | void                                 | Reset state with default state value                |
| dispatch(actions: ActionType &verbar; ActionType[])                                                   | void                                 | Standard dispatch method                            |
| state.state\$                                                                                         | Observable&lt;Immutable&lt;T&gt;&gt; | State data stream that you can subscribe to changes |

-   `NgxsDataEntityCollectionsRepository<V, K>` a standard repository class for entity which provides an API to
    manipulate and query entity collections.

```ts
@StateRepository()
@State({
    name: 'article',
    defaults: createEntityCollections()
})
@Injectable()
class ArticleEntitiesState extends NgxsDataEntityCollectionsRepository<Article> {}
```

| Method/Property                                     | Return type                                         | Description                                                                 |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------- |
| state.name                                          | string                                              | State name                                                                  |
| state.initialState                                  | NgxsEntityCollections&lt;V, K&gt;                   | Default state value                                                         |
| state.getState()                                    | NgxsEntityCollections&lt;V, K&gt;                   | Current state value                                                         |
| state.snapshot                                      | NgxsEntityCollections&lt;V, K&gt;                   | Memoized state value (getter)                                               |
| state.reset()                                       | void                                                | Reset state with default state value                                        |
| state.state\$                                       | Observable&lt;NgxsEntityCollections&lt;V, K&gt;&gt; | State data stream that you can subscribe to changes                         |
| dispatch(actions: ActionType &verbar; ActionType[]) | void                                                | Standard dispatch method                                                    |
| state.addOne(entity: V)                             | void                                                | Add one entity to the collection                                            |
| state.addMany(entities: V[])                        | void                                                | Add multiple entities to the collection                                     |
| state.setOne(entity: V)                             | void                                                | Add or Replace one entity in the collection                                 |
| state.setMany(entities: V[])                        | void                                                | Add or Replace multiple entities to the collection                          |
| state.setAll(entities: V[])                         | void                                                | Replace current collection with provided collection                         |
| state.updateOne(update: EntityUpdate<V, K>)         | void                                                | Update one entity in the collection. Supports partial updates               |
| state.updateMany(updates: EntityUpdate<V, K>[])     | void                                                | Update multiple entities in the collection. Supports partial updates        |
| state.upsertOne(entity: V)                          | void                                                | Add or Update one entity in the collection. Supports partial updates        |
| state.upsertMany(entities: V[])                     | void                                                | Add or Update multiple entities in the collection. Supports partial updates |
| state.removeOne(id: K)                              | void                                                | Remove one entity from the collection                                       |
| state.removeMany(ids: K[])                          | void                                                | Remove multiple entities from the collection                                |
| state.removeAll()                                   | void                                                | Remove all entities from the collection                                     |

### Composition

You can compose multiple stores together using class inheritance. This is quite simple:

```ts
abstract class CommonCounter extends NgxsDataRepository<number> {
    @DataAction()
    public increment() {
        this.ctx.setState((state: number) => ++state);
    }
}

@StateRepository()
@State({
    name: 'a',
    defaults: 0
})
@Injectable()
class A extends CommonCounter {}

@StateRepository()
@State({
    name: 'b',
    defaults: 0
})
@Injectable()
class B extends CommonCounter {}

@Component({
    selector: 'app'
    // ..
})
class AppComponent implements OnInit {
    constructor(public a: A, public b: B) {}

    public ngOnInit(): void {
        console.log(a.snapshot); // 0
        console.log(b.snapshot); // 0
    }
}
```

Now when `A` or `B` is invoked, it will share the actions of the `CommonCounter`. Also, all state options are inherited
if add `@State` under `CommonCounter`.

```ts
@State({
    name: 'commonCounter',
    defaults: 0
})
@Injectable()
class CommonCounterState extends NgxsDataRepository<number> {
    @DataAction()
    public increment() {
        this.ctx.setState((state: number) => ++state);
    }
}

@StateRepository()
@State({ name: 'a' })
@Injectable()
class A extends CommonCounterState {}

@StateRepository()
@State({ name: 'b' })
@Injectable()
class B extends CommonCounterState {}

@Component({
    selector: 'app'
    // ..
})
class AppComponent implements OnInit {
    constructor(public a: A, public b: B) {}

    public ngOnInit(): void {
        console.log(a.snapshot); // 0
        console.log(b.snapshot); // 0
    }
}
```
