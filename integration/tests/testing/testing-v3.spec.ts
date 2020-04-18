import { ngxsTestingPlatform } from '@ngxs-labs/data/testing';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Injectable } from '@angular/core';
import { State, Store } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

describe('AppState', () => {
    @StateRepository()
    @State({
        name: 'app',
        defaults: 'hello world'
    })
    @Injectable()
    class AppState extends NgxsDataRepository<string> {}

    it(
        'should be correct ensure state from AppState',
        ngxsTestingPlatform([AppState], (store: Store, app: AppState) => {
            expect(store.snapshot()).toEqual({ app: 'hello world' });
            expect(app.getState()).toEqual('hello world');
        })
    );

    it('Invalid state', async () => {
        class InvalidState {}
        let message: string | null = null;

        try {
            await ngxsTestingPlatform([InvalidState], () => {})();
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual('InvalidState class must be decorated with @State() decorator');
    });
});
