/// <reference types="@types/jest" />
import { NgxsModule, Select, Selector, State } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Component, Injectable } from '@angular/core';

import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Immutable } from '@ngxs-labs/data/typings';
import { DataAction, Persistence, StateRepository } from '@ngxs-labs/data/decorators';

describe('NGXS Integration', () => {
    it('should be correct patch', () => {
        interface Todo {
            userId: number;
            id: number;
            title: string;
            completed: boolean;
        }

        class TodoStateModel {
            todos: Todo[];
            loaded: boolean;
            selectedTodo: Todo;
        }

        @Injectable({ providedIn: 'root' })
        class TodoApiService {
            private readonly baseUrl: string;

            constructor(private readonly http: HttpClient) {
                this.baseUrl = 'https://jsonplaceholder.typicode.com';
            }

            fetchTodos() {
                const url = this.baseUrl + '/todos';
                return this.http.get<Todo[]>(url);
            }

            addTodo(payload: Todo) {
                const url = this.baseUrl + '/todos';
                return this.http.post<Todo>(url, payload);
            }

            deleteTodo(id: number) {
                const url = this.baseUrl + '/todos/' + id;
                return this.http.delete(url);
            }

            updateTodo(payload: Todo, id: number) {
                const url = this.baseUrl + '/todos/' + id;
                return this.http.put<Todo>(url, payload);
            }

            // Emulate http request
            public getTodos(): Observable<Todo[]> {
                return of([
                    { userId: 1, id: 1, title: 'delectus aut autem', completed: false },
                    { userId: 2, id: 2, title: 'et porro tempora', completed: false },
                    { userId: 3, id: 3, title: 'fugiat veniam minus', completed: true },
                    { userId: 4, id: 4, title: 'quo adipisci enim quam', completed: false },
                    { userId: 5, id: 5, title: 'molestiae perspiciatis ipsa', completed: true }
                ]);
            }
        }

        @Persistence([{ path: 'todos', existingEngine: localStorage }])
        @StateRepository()
        @State<TodoStateModel>({
            name: 'todos',
            defaults: {
                todos: [],
                loaded: false,
                selectedTodo: null!
            }
        })
        class TodoState extends NgxsImmutableDataRepository<TodoStateModel> {
            @Select(TodoState)
            public readonly todos$: Observable<TodoStateModel>;

            constructor(private readonly api: TodoApiService) {
                super();
            }

            @Selector()
            static todos(state: TodoStateModel): Todo[] {
                return state.todos;
            }

            @Selector()
            static selectedTodo(state: TodoStateModel): Todo {
                return state.selectedTodo;
            }

            @DataAction()
            getTodos() {
                const state = this.ctx.getState();
                this.api
                    .getTodos()
                    .pipe(
                        tap((result: Todo[]) => {
                            console.log('result', result);
                        })
                    )
                    .subscribe((result: Todo[]) => {
                        if (result) {
                            this.ctx.setState({ ...state, todos: result, loaded: true });
                        } else {
                            this.ctx.setState({ ...state, todos: state.todos, loaded: false });
                        }
                    });
            }

            @DataAction()
            addTodo(todo: Todo) {}

            @DataAction()
            updateTodo(id: number) {}

            @DataAction()
            deleteTodo(id: number) {}

            @DataAction()
            setSelectedTodoId(id: number) {
                const state = this.ctx.getState();
            }

            @DataAction()
            public toggleCompleted(index: number) {
                const state = this.ctx.getState();

                this.ctx.setState(
                    // $ExpectError
                    patch({
                        todos: updateItem(index, patch({ completed: (value) => !value }))
                    })
                );

                this.ctx.setState(
                    // $ExpectType PatchOperator<Immutable<TodoStateModel>>
                    patch<Immutable<TodoStateModel>>({
                        todos: updateItem<Todo>(index, patch({ completed: (value) => !value }))
                    })
                );

                this.ctx.patchState(state);
            }
        }
    });

    it('Invoke StateListState', () => {
        interface ListModel {
            a: number;
            b: number;
        }

        @StateRepository()
        @State<ListModel[]>({
            name: 'stateList',
            defaults: [
                { a: 1, b: 2 },
                { a: 3, b: 4 }
            ]
        })
        @Injectable()
        class StateListState extends NgxsImmutableDataRepository<ListModel[]> {}

        @Component({ selector: 'app', template: '{{ app.state$ | async | json }}' })
        class AppComponent {
            constructor(public app: StateListState) {}
        }

        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [NgxsModule.forRoot([StateListState]), NgxsDataPluginModule.forRoot()]
        }).compileComponents();

        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        fixture.autoDetectChanges();

        const state: StateListState = fixture.componentInstance.app;

        const mutableList: ListModel[] = state.getState(); // $ExpectError

        function mutate(list: ListModel[]): ListModel[] {
            return list.reverse();
        }

        mutate(state.getState()); // $ExpectError

        state.getState()[0].a++; // $ExpectError

        state.setState([{ b: 2 }]); // $ExpectError

        state.setState([{ a: 1, b: 2 }]); // $ExpectType void

        state.setState(
            // $ExpectType (state: readonly Immutable<ListModel>[]) => readonly Immutable<ListModel>[]
            (state: Immutable<ListModel[]>) => {
                return state;
            }
        );

        state.setState(
            // $ExpectError
            (state: Immutable<ListModel[]>): void => {
                state;
            }
        );

        state.setState(
            // $ExpectError
            (state) => {
                state;
            }
        );

        state.setState(
            // $ExpectError
            (state: ListModel[]) => {
                state.reverse();
            }
        );

        state.setState(
            // $ExpectError
            (state: ListModel[]) => {
                return state;
            }
        );

        state.setState(
            // $ExpectError
            (state: ListModel[]) => {
                state;
            }
        );

        state.setState(
            // $ExpectType (state: readonly Immutable<ListModel>[]) => readonly Immutable<ListModel>[]
            (state) => {
                return state;
            }
        );

        state.setState(
            // $ExpectType (state: readonly Immutable<ListModel>[]) => readonly Immutable<ListModel>[]
            (state) => {
                state.reverse(); // $ExpectError
                return state;
            }
        );
    });
});
