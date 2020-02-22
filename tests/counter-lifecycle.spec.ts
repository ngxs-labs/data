import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ApplicationRef, Component, Injectable, NgModule, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
    BrowserModule,
    ɵBrowserDomAdapter as BrowserDomAdapter,
    ɵDomAdapter as DomAdapter
} from '@angular/platform-browser';
import { NgxsDataPluginModule, NgxsDataRepository, StateRepository } from '@ngxs-labs/data';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/common';
import { NgxsAfterBootstrap, NgxsModule, NgxsOnInit, State, Store } from '@ngxs/store';

describe('Complex lifecycle', () => {
    @Injectable()
    class MyApiService {}

    it('should be throw when use context before app initial', () => {
        @Injectable()
        @StateRepository()
        @State({
            name: 'count',
            defaults: 0
        })
        class CountState extends NgxsDataRepository<number> {
            public value: number | null = null;
            constructor(public myService: MyApiService) {
                super();
                this.value = 1;
                this.ctx.setState(this.value);
            }
        }

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([CountState]), NgxsDataPluginModule.forRoot()],
            providers: [MyApiService]
        });

        try {
            TestBed.get<CountState>(CountState);
            TestBed.get<Store>(Store);
        } catch (e) {
            expect(e.message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_MODULE_EXCEPTION);
        }
    });

    it('should be correct lifecycle', () => {
        const hooks: string[] = [];

        @Injectable()
        @StateRepository()
        @State({
            name: 'count',
            defaults: 0
        })
        class CountState extends NgxsDataRepository<number> implements NgxsOnInit, NgxsAfterBootstrap {
            constructor(public myService: MyApiService) {
                super();
                hooks.push('CountState - create');
            }

            public ngxsOnInit(): void {
                hooks.push('CountState - ngxsOnInit');
            }

            public ngxsAfterBootstrap(): void {
                hooks.push('CountState - ngxsAfterBootstrap');
            }
        }

        @Component({
            selector: 'app-root',
            template: ''
        })
        class NgxsTestComponent implements OnInit, AfterViewInit {
            public ngOnInit(): void {
                hooks.push('NgxsTestComponent - ngOnInit');
            }
            public ngAfterViewInit(): void {
                hooks.push('NgxsTestComponent - ngAfterViewInit');
            }
        }

        @NgModule({
            imports: [BrowserModule],
            declarations: [NgxsTestComponent],
            entryComponents: [NgxsTestComponent]
        })
        class AppTestModule {
            public static ngDoBootstrap(app: ApplicationRef): void {
                AppTestModule.createRootNode();
                app.bootstrap(NgxsTestComponent);
            }

            private static createRootNode(selector = 'app-root'): void {
                const document = TestBed.get(DOCUMENT);
                const adapter: DomAdapter = new BrowserDomAdapter();

                const root = adapter.firstChild(adapter.content(adapter.createTemplate(`<${selector}></${selector}>`)));

                const oldRoots = adapter.querySelectorAll(document, selector);
                oldRoots.forEach((oldRoot) => adapter.remove(oldRoot));

                adapter.appendChild(document.body, root);
            }
        }

        TestBed.configureTestingModule({
            imports: [AppTestModule, NgxsModule.forRoot([CountState]), NgxsDataPluginModule.forRoot()],
            providers: [MyApiService]
        });

        AppTestModule.ngDoBootstrap(TestBed.get(ApplicationRef));

        expect(hooks).toEqual([
            'CountState - create',
            'CountState - ngxsOnInit',
            'NgxsTestComponent - ngOnInit',
            'NgxsTestComponent - ngAfterViewInit',
            'CountState - ngxsAfterBootstrap'
        ]);
    });
});
