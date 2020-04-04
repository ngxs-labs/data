import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { Injectable } from '@angular/core';
import { NGXS_ARGUMENT_REGISTRY_META, NGXS_DATA_META, NGXS_META_KEY } from '@ngxs-labs/data/tokens';
import { DataStateClass } from '@ngxs-labs/data/typings';

describe('[TEST]: NGXS_META', () => {
    it('DataStateClass', () => {
        @StateRepository()
        @State({ name: 'app' })
        @Injectable()
        class AppState {}

        expect(NGXS_META_KEY).toEqual('NGXS_META');
        expect(NGXS_DATA_META).toEqual('NGXS_DATA_META');
        expect(NGXS_ARGUMENT_REGISTRY_META).toEqual('NGXS_ARGUMENT_REGISTRY_META');

        expect((AppState as DataStateClass)[NGXS_META_KEY]).toEqual({
            name: 'app',
            actions: {},
            defaults: undefined,
            path: null,
            makeRootSelector: expect.any(Function),
            children: undefined
        });

        expect((AppState as DataStateClass)[NGXS_DATA_META]).toEqual({
            stateMeta: {
                name: 'app',
                actions: {},
                defaults: undefined,
                path: null,
                makeRootSelector: expect.any(Function),
                children: undefined
            },
            operations: {},
            stateClass: AppState
        });
    });
});
