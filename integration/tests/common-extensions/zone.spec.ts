import { ngxsTestingPlatform } from '@ngxs-labs/data/testing';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Injectable, NgZone } from '@angular/core';
import { State } from '@ngxs/store';
import { DataAction, StateRepository } from '@ngxs-labs/data/decorators';

describe('[TEST]: Zone', () => {
    @StateRepository()
    @State({
        name: 'counter',
        defaults: 0
    })
    @Injectable()
    class CounterState extends NgxsDataRepository<number> {
        public inside: number = 0;
        public outside: number = 0;

        @DataAction()
        public increment(): number {
            return this._increment();
        }

        @DataAction({ insideZone: true })
        public incrementInZone(): number {
            return this._increment();
        }

        public incrementWithoutAction(): number {
            return this._increment();
        }

        private _increment(): number {
            if (NgZone.isInAngularZone()) {
                this.inside += 1;
            } else {
                this.outside += 1;
            }

            const newState: number = this.getState() + 1;
            this.ctx.setState(newState);
            return newState;
        }
    }

    it(
        'should be works inside/outside zone',
        ngxsTestingPlatform([CounterState], (_store, state) => {
            expect(state.increment()).toEqual(1);

            expect(state.outside).toEqual(1);
            expect(state.inside).toEqual(0);
            expect(state.getState()).toEqual(1);

            expect(state.incrementWithoutAction()).toEqual(2);

            expect(state.outside).toEqual(2);
            expect(state.inside).toEqual(0);
            expect(state.getState()).toEqual(2);

            expect(state.incrementInZone()).toEqual(3);

            expect(state.outside).toEqual(2);
            expect(state.inside).toEqual(1);
            expect(state.getState()).toEqual(3);
        })
    );
});
