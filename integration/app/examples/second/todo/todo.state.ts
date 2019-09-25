import { action, Immutable, NgxsDataRepository, StateRepository } from '@ngxs-labs/data';
import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';

@Injectable()
@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
export class TodoState extends NgxsDataRepository<string[]> {
    @action() public addTodo(todo: string): void {
        this.ctx.setState((state: Immutable<string[]>) => state.concat(todo));
    }

    @action() public removeTodo(idx: number): void {
        this.ctx.setState((state: Immutable<string[]>) => state.filter((_: string, index: number) => index !== idx));
    }
}
