import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { DataAction, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository, NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { NgxsModule, Selector, State, Store } from '@ngxs/store';
import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';

describe('Inheritance', () => {
    it('should be throw', () => {
        try {
            abstract class CountRepo extends NgxsImmutableDataRepository<number> {
                // @ts-ignore
                @DataAction() public increment;
            }

            @Injectable()
            @StateRepository()
            @State({
                name: 'count',
                defaults: 0
            })
            class CountState extends CountRepo {}

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([CountState])]
            });
        } catch (e) {
            expect(e.message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_ACTION);
        }
    });

    it('should be correct work with Persistence, StateRepository, Selector decorators', () => {
        @Injectable({ providedIn: 'root' })
        class TodoApiService {}

        interface Todo {
            userId: number;
            id: number;
            title: string;
            completed: boolean;
        }

        class TodoStateModel {
            todos: Todo[] = [];
            loaded: boolean = false;
            selectedTodo: Todo | null = null;
        }

        @Persistence([
            {
                path: 'todos',
                existingEngine: localStorage
            }
        ])
        @StateRepository()
        @State<TodoStateModel>({
            name: 'todos',
            defaults: {
                todos: [],
                loaded: false,
                selectedTodo: null
            }
        })
        @Injectable()
        class TodoState extends NgxsDataRepository<TodoStateModel> {
            @Selector()
            public static todos(state: TodoStateModel) {
                return state.todos;
            }

            constructor(protected readonly api: TodoApiService) {
                super();
            }

            @DataAction()
            public getTodos() {}
        }

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([TodoState]), NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN])]
        });

        const store: Store = TestBed.inject<Store>(Store);

        expect(store.snapshot()).toEqual({ todos: { todos: [], loaded: false, selectedTodo: null } });
        expect(store.selectSnapshot(TodoState.todos)).toEqual([]);
    });

    it('should be correct with inheritance', () => {
        abstract class CountRepo extends NgxsImmutableDataRepository<number> {
            @DataAction()
            public decrement(): void {
                this.ctx.setState((state) => --state);
            }
        }

        @Injectable()
        @StateRepository()
        @State({
            name: 'count',
            defaults: 0
        })
        class CountState extends CountRepo {
            @DataAction()
            public increment(): void {
                this.ctx.setState((state) => ++state);
            }
        }

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([CountState]), NgxsDataPluginModule.forRoot()]
        });

        const store: Store = TestBed.inject<Store>(Store);
        const count: CountState = TestBed.inject<CountState>(CountState);

        expect(store.snapshot()).toEqual({ count: 0 });
        expect(count.getState()).toEqual(0);

        count.increment();
        count.decrement();
        count.increment();

        expect(store.snapshot()).toEqual({ count: 1 });
        expect(count.getState()).toEqual(1);
    });
});
