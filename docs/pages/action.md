## Action

`@action` - This decorator emulates the execution of asynchronous or synchronous actions. Actions can either be thought
of as a command which should trigger something to happen.

#### Before (origin NGXS behavior)

```ts
export class AddTodo {
    public static type = '[Add todo]';
    constructor(public payload: string) {}
}

@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsDataRepository<string[]> {
    @Action(AddTodo)
    public add({ setState }: StateContext<string[]>, { payload }: AddTodo): void {
        setState((state) => state.concat(payload));
    }
}
```

```ts
@Component({
    selector: 'app',
    template: `
        <input #inputElement />
        <button (click)="addTodo(inputElement.value)">Add todo</button>
    `
})
class AppComponent {
    constructor(private store: Store) {}

    public addTodo(value: string): void {
        this.store.dispatch(new AddTodo(value));
    }
}
```

#### After (Data-plugin behavior)

```ts
@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsDataRepository<string[]> {
    @action()
    public add(todo: string): void {
        this.ctx.setState((state) => state.concat(todo));
    }
}
```

```ts
@Component({
    selector: 'app',
    template: `
        <input #inputElement />
        <button (click)="todo.add(inputElement.value)">Add todo</button>
    `
})
class AppComponent {
    constructor(private todo: TodoState) {}
}
```

The method `todo.add(payload)` is the same as `store.dispatch({ type: '@todo.add', todo: payload })`.

What are the benefits?

-   No need to create action classes
-   Typing improvements for state context
-   Explicit interaction with states
