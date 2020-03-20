## (@)StateRepository

`@StateRepository` - This is a decorator that provides an extension of the functionality of NGXS states, thanks to which
you get access to the internal mechanism of the NGXS.

By default, you can inherit from abstract classes that give you different benefits:

-   `NgxsDataRepository` a standard repository class that gives you control over your state.

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

-   `NgxsImmutableDataRepository` It is the descendant of the _`NgxsDataRepository`_ class, however it gives you
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
| state.snapshot                                                                                        | T                                    | Memoized state value (getter)                       |
| state.patchState(Partial&lt;T &verbar; Immutable&lt;T&gt;)                                            | void                                 | Ability to update part of the state                 |
| state.setState(Immutable&lt;T> &verbar; T &verbar; (state: Immutable&lt;T&gt;) => Immutable&lt;T&gt;) | void                                 | Overwrite state                                     |
| state.reset()                                                                                         | void                                 | Reset state with default state value                |
| dispatch(actions: ActionType &verbar; ActionType[])                                                   | void                                 | Standard dispatch method                            |
| state.state\$                                                                                         | Observable&lt;Immutable&lt;T&gt;&gt; | State data stream that you can subscribe to changes |
