/* eslint-disable */

import { NgxsModule, State } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { action } from '@ngxs-labs/data/decorators';

describe('[TEST]: Action decorator', () => {
    it("should be don't working without @StateRepository decorator", () => {
        let message: string | null = null;

        try {
            @State({ name: 'custom', defaults: 'hello world' })
            @Injectable()
            class InvalidState extends NgxsDataRepository<string> {
                @action()
                public setup(val: string): void {
                    this.ctx.setState(val);
                }
            }

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([InvalidState]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            const state: InvalidState = TestBed.get(InvalidState);
            state.setState('new value');

            console.log(state.getState());
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
    });

    it("should be don't working without @StateRepository and @State decorator", () => {
        let message: string | null = null;

        try {
            @Injectable()
            class InvalidState extends NgxsDataRepository<string> {
                @action()
                public setup(val: string): void {
                    this.ctx.setState(val);
                }
            }

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([InvalidState]), NgxsDataPluginModule.forRoot(NGXS_DATA_STORAGE_PLUGIN)]
            });

            const state: InvalidState = TestBed.get(InvalidState);
            state.setState('new value');

            console.log(state.getState());
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual('States must be decorated with @State() decorator');
    });
});
