import { Injectable } from '@angular/core';
import { DataAction, payload, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { Immutable } from '@ngxs-labs/data/typings';
import { State } from '@ngxs/store';

@Persistence()
@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsImmutableDataRepository<string[]> {
    @DataAction()
    public addTodo(@payload('todo') todo: string): void {
        if (todo) {
            this.ctx.setState((state: Immutable<string[]>): Immutable<string[]> => state.concat(todo));
        }
    }

    @DataAction()
    public removeTodo(@payload('idx') idx: number): void {
        this.ctx.setState(
            (state: Immutable<string[]>): Immutable<string[]> =>
                state.filter((_: string, index: number): boolean => index !== idx)
        );
    }
}
