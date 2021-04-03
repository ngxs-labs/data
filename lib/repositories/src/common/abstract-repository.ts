import { Injectable } from '@angular/core';
import { ActionType, NgxsAfterBootstrap, NgxsOnChanges, NgxsOnInit, NgxsSimpleChange } from '@ngxs/store';
import { NgxsDataAfterReset, NgxsDataDoCheck, NgxsDataStorageEvent } from '@ngxs-labs/data/typings';
import { Observable, Subject } from 'rxjs';

@Injectable()
export abstract class AbstractRepository<T> implements NgxsOnChanges, NgxsOnInit, NgxsAfterBootstrap {
    public browserStorageEvents$: Subject<NgxsDataStorageEvent<T>> = new Subject();
    public readonly name!: string;
    public readonly initialState!: T;
    public readonly state$!: Observable<T>;
    public isInitialised: boolean = false;
    public isBootstrapped: boolean = false;

    public abstract get snapshot(): T;

    private _dirty: boolean = true;

    protected get dirty(): boolean {
        return this._dirty;
    }

    protected set dirty(value: boolean) {
        this._dirty = value;
    }

    public ngxsOnChanges(_?: NgxsSimpleChange): void {
        if (this.dirty && this.isBootstrapped) {
            this.dirty = false;
            (this as NgxsDataDoCheck).ngxsDataDoCheck?.();
        }
    }

    public ngxsOnInit(): void {
        this.isInitialised = true;
    }

    public ngxsAfterBootstrap(): void {
        this.isBootstrapped = true;
        if (this.dirty) {
            this.dirty = false;
            (this as NgxsDataDoCheck).ngxsDataDoCheck?.();
        }
    }

    public abstract getState(): T;

    public abstract dispatch(actions: ActionType | ActionType[]): Observable<void>;

    public abstract reset(): void;

    protected markAsDirtyAfterReset(): void {
        this.dirty = true;
        (this as NgxsDataAfterReset).ngxsDataAfterReset?.();
    }
}
