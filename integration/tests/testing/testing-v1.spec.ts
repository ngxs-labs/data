import { TestBed } from '@angular/core/testing';
import { NgxsDataTestingModule } from '@ngxs-labs/data/testing';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Injectable } from '@angular/core';
import { DataAction, StateRepository } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { NgxsDataAfterReset, NgxsDataDoCheck } from '@ngxs-labs/data/typings';

describe('[TEST]: NgxsTestingModule', () => {
    describe('AppState', () => {
        const events: string[] = [];

        @StateRepository()
        @State({
            name: 'app',
            defaults: 0
        })
        @Injectable()
        class AppState extends NgxsDataRepository<number> implements NgxsDataDoCheck, NgxsDataAfterReset {
            public ngxsOnChanges(): void {
                events.push(`${this.name}::ngxsOnChanges`);
                super.ngxsOnChanges();
            }

            public ngxsOnInit(): void {
                events.push(`${this.name}::ngxsOnInit`);
                super.ngxsOnInit();
            }

            public ngxsDataDoCheck(): void {
                events.push(`${this.name}::ngxsDataDoCheck`);
            }

            public ngxsDataAfterReset(): void {
                events.push(`${this.name}::ngxsDataAfterReset`);
            }

            public ngxsAfterBootstrap(): void {
                events.push(`${this.name}::ngxsAfterBootstrap`);
                super.ngxsAfterBootstrap();
            }

            @DataAction()
            public increment(): void {
                this.ctx.setState((state) => ++state);
                events.push(`${this.name}::increment`);
            }
        }

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NgxsDataTestingModule.forRoot([AppState])]
            });
        });

        it('should be correct bootstrap ngxs testing', () => {
            NgxsDataTestingModule.ngxsInitPlatform();
            const app: AppState = TestBed.inject(AppState);

            app.increment();
            app.increment();

            expect(app.getState()).toEqual(2);

            app.reset();

            app.increment();
            app.increment();
            app.increment();

            expect(app.getState()).toEqual(3);

            app.reset();

            expect(events).toEqual([
                'app::ngxsOnChanges',
                'app::ngxsOnInit',
                'app::ngxsAfterBootstrap',
                'app::ngxsDataDoCheck',
                'app::ngxsOnChanges',
                'app::increment',
                'app::ngxsOnChanges',
                'app::increment',
                'app::ngxsOnChanges',
                'app::ngxsDataAfterReset',
                'app::ngxsOnChanges',
                'app::ngxsDataDoCheck',
                'app::increment',
                'app::ngxsOnChanges',
                'app::increment',
                'app::ngxsOnChanges',
                'app::increment',
                'app::ngxsOnChanges',
                'app::ngxsDataAfterReset'
            ]);
        });
    });
});
