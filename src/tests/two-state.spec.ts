import { NgxsModule, State, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { action, NgxsDataPluginModule, NgxsDataRepository, StateRepository } from '@ngxs-labs/data';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

describe('Correct behavior NGXS DATA with Count, Todo states', () => {
    let store: Store;
    let count: CountState;
    let todo: TodoState;

    @Injectable()
    class ApiService {
        public getData(): Observable<number> {
            return of(20).pipe(delay(2000));
        }
    }

    @Injectable()
    @StateRepository()
    @State({
        name: 'count',
        defaults: 0
    })
    class CountState extends NgxsDataRepository<number> {
        constructor(private api: ApiService) {
            super();
        }

        @action() public increment(): void {
            this.ctx.setState((state) => ++state);
        }

        public incorrectReturnedValue(val: number): void {
            this.ctx.setState(val);
        }

        public setValue(val: number): void {
            this.setState(val);
        }

        public asyncSetState() {
            return this.api.getData().pipe(tap((val: number) => this.ctx.setState(val)));
        }
    }

    @Injectable()
    @StateRepository()
    @State<string[]>({
        name: 'todos',
        defaults: []
    })
    class TodoState extends NgxsDataRepository<string[]> {
        constructor(private counter: CountState) {
            super();
        }

        @action() public add(val: string): TodoState {
            this.ctx.setState((state) => state.concat(val));
            this.counter.increment();
            return this;
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([CountState, TodoState]), NgxsDataPluginModule.forRoot()],
            providers: [ApiService]
        });

        count = TestBed.get<CountState>(CountState);
        store = TestBed.get<Store>(Store);
        todo = TestBed.get<TodoState>(TodoState);
    });

    it('should be identify non-obvious behavior', () => {
        count.setValue(5);
        expect(count.getState()).toEqual(5);
        expect(store.snapshot()).toEqual({ todos: [], count: 5 });

        count.incorrectReturnedValue(15);
        expect(count.getState()).toEqual(15);
        expect(store.snapshot()).toEqual({ todos: [], count: 15 });
    });

    it('should be correct async', fakeAsync(() => {
        let result: number = null;
        count.asyncSetState().subscribe((response: number) => (result = response));

        tick(2000);

        expect(result).toEqual(20);
        expect(count.getState()).toEqual(20);
    }));

    it('should be correct injectable state', () => {
        expect(store.snapshot()).toEqual({ todos: [], count: 0 });

        todo.add('A')
            .add('B')
            .add('C');

        expect(store.snapshot()).toEqual(store.snapshot());

        todo.reset();
        count.reset();

        expect(store.snapshot()).toEqual({ todos: [], count: 0 });
    });
});
