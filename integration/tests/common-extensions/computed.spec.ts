/* eslint-disable */
import { Injectable } from '@angular/core';
import { NgxsModule, State } from '@ngxs/store';
import { computed, StateRepository } from '@ngxs-labs/data/decorators';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { getSequenceIdFromTarget } from '@ngxs-labs/data/internals';

describe('[TEST]: Computed fields', () => {
    it('should be throw when invalid annotated', () => {
        let message: string | null = null;

        try {
            @StateRepository()
            @State({ name: 'a', defaults: 'value' })
            @Injectable()
            class A extends NgxsDataRepository<string> {
                @computed()
                public snapshot(): string {
                    return this.ctx.getState();
                }
            }

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([A]), NgxsDataPluginModule.forRoot()]
            });
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual(
            NGXS_DATA_EXCEPTIONS.NGXS_COMPUTED_DECORATOR + `\nExample: \n@computed get snapshot() { \n\t .. \n}`
        );
    });

    it('should be correct memoized state', () => {
        @StateRepository()
        @State({ name: 'b', defaults: 'value' })
        @Injectable()
        class B extends NgxsDataRepository<string> {
            public countSnapshot: number = 0;

            @computed()
            public get snapshot(): string {
                this.countSnapshot++;
                return this.ctx.getState();
            }
        }

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([B]), NgxsDataPluginModule.forRoot()]
        });

        const b: B = TestBed.get<B>(B); // sequenceId = 0

        expect(b.snapshot).toEqual('value');
        expect(b.snapshot).toEqual('value');
        expect(b.snapshot).toEqual('value');
        expect(b.snapshot).toEqual('value');
        expect(b.snapshot).toEqual('value');

        b.setState('hello'); // sequenceId = 1

        expect(b.snapshot).toEqual('hello');
        expect(b.snapshot).toEqual('hello');
        expect(b.countSnapshot).toEqual(2);

        b.setState('world'); // sequenceId = 2

        expect(b.snapshot).toEqual('world');
        expect(b.snapshot).toEqual('world');
        expect(b.snapshot).toEqual('world');
        expect(b.snapshot).toEqual('world');
        expect(b.countSnapshot).toEqual(3);

        expect(getSequenceIdFromTarget(b)).toEqual(2);
    });
});
