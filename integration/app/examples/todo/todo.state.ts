import { Injectable } from '@angular/core';
import { action, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Immutable } from '@ngxs-labs/data/typings';
import { State } from '@ngxs/store';

@Persistence()
@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsDataRepository<string[]> {
    @action()
    public addTodo(todo: string): void {
        if (todo) {
            this.ctx.setState((state: Immutable<string[]>) => state.concat(todo));
        }
    }

    @action()
    public removeTodo(idx: number): void {
        this.ctx.setState((state: Immutable<string[]>) => state.filter((_: string, index: number) => index !== idx));
    }
}
