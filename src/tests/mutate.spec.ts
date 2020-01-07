import { NgxsModule, State, Store } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import {
    DeepImmutableArray,
    NGXS_DATA_EXCEPTIONS,
    NgxsDataPluginModule,
    NgxsDataRepository,
    StateRepository
} from '@ngxs-labs/data';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

describe('Mutate', () => {
    let store: Store;

    it('should be throw incorrect provides', () => {
        let message: string | null = null;

        try {
            @StateRepository()
            @State({ name: 'todos', defaults: [1, 3] })
            @Injectable()
            class TodosState extends NgxsDataRepository<string[]> {
                // noinspection JSUnusedGlobalSymbols
                public mutable$ = this.state$.pipe(map((state) => (state as string[]).reverse()));
            }

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([TodosState])]
            });

            store = TestBed.get<Store>(Store);
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
    });

    it('should be check mutate state', () => {
        @StateRepository()
        @State({ name: 'todos', defaults: [1, 2, 3] })
        @Injectable()
        class TodosState extends NgxsDataRepository<string[]> {
            public mutable$(): Observable<DeepImmutableArray<string>> {
                return this.state$.pipe(map((state) => (state as string[]).reverse()));
            }
        }

        TestBed.configureTestingModule({
            imports: [
                NgxsModule.forRoot([TodosState]),
                NgxsDataPluginModule.forRoot()
            ]
        });

        store = TestBed.get<Store>(Store);

        const todo: TodosState = TestBed.get<TodosState>(TodosState);
        expect(store.snapshot()).toEqual({ todos: [1, 2, 3] });

        let error: string | null = null;

        todo.state$.pipe(map((state) => state.concat().reverse())).subscribe((state) => {
            expect(store.snapshot()).toEqual({ todos: [1, 2, 3] });
            expect(state).toEqual([3, 2, 1]);
        });

        // TODO: need fix
        todo.mutable$().subscribe(
            () => {},
            (e) => {
                error = e.message;
            }
        );

        expect(error).toEqual(`Cannot assign to read only property '0' of object '[object Array]'`);
        expect(store.snapshot()).toEqual({ todos: [1, 2, 3] });
    });
});
