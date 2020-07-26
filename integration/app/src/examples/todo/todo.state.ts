import { Immutable } from '@angular-ru/common/typings';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataAction, Payload, Persistence, StateRepository } from '@ngxs-labs/data/decorators';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { NgxsDataAfterExpired, NgxsDataExpiredEvent, PersistenceProvider } from '@ngxs-labs/data/typings';
import { State } from '@ngxs/store';
import { Subject } from 'rxjs';

@Persistence({
    ttlDelay: 5000,
    fireInit: false,
    ttl: 30000, // 30 * 1000 = 30sec,
    existingEngine: localStorage
})
@StateRepository()
@State<string[]>({
    name: 'todo',
    defaults: []
})
@Injectable()
export class TodoState extends NgxsImmutableDataRepository<string[]> implements NgxsDataAfterExpired {
    public expired$: Subject<NgxsDataExpiredEvent> = new Subject();

    constructor(private readonly snackBar: MatSnackBar) {
        super();
    }

    public ngxsDataAfterExpired(event: NgxsDataExpiredEvent, _provider: PersistenceProvider): void {
        this.snackBar.open('Expired', event.key, {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
        });
    }

    @DataAction()
    public addTodo(@Payload('todo') todo: string): void {
        if (todo) {
            this.ctx.setState((state: Immutable<string[]>): Immutable<string[]> => state.concat(todo));
        }
    }

    @DataAction()
    public removeTodo(@Payload('idx') idx: number): void {
        this.ctx.setState(
            (state: Immutable<string[]>): Immutable<string[]> =>
                state.filter((_: string, index: number): boolean => index !== idx)
        );
    }
}
