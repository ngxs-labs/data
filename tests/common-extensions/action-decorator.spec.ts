/* eslint-disable */
import { NgxsModule, State } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';
import { action, StateRepository } from '@ngxs-labs/data/decorators';
import { getRepository } from '@ngxs-labs/data/internals';

describe('[TEST]: Action decorator', () => {
    it("don't should be working without @StateRepository decorator", () => {
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
                imports: [NgxsModule.forRoot([InvalidState]), NgxsDataPluginModule.forRoot()]
            });

            const state: InvalidState = TestBed.get(InvalidState);
            state.setState('new value');

            console.log(state.getState());
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
    });

    it("don't should be working without @StateRepository and @State decorator", () => {
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
                imports: [NgxsModule.forRoot([InvalidState]), NgxsDataPluginModule.forRoot()]
            });

            const state: InvalidState = TestBed.get(InvalidState);
            state.setState('new value');

            console.log(state.getState());
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual('States must be decorated with @State() decorator');
    });

    it("don't should be working without provided meta information", () => {
        let message: string | null = null;

        try {
            @State({ name: 'custom', defaults: 'hello world' })
            @Injectable()
            class InvalidState {
                @action()
                public setup(): void {}
            }

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([InvalidState]), NgxsDataPluginModule.forRoot()]
            });

            const state: InvalidState = TestBed.get(InvalidState);
            state.setup();
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
    });

    it("don't should be working when register as service", () => {
        let message: string | null = null;

        try {
            @State({ name: 'custom', defaults: 'hello world' })
            @Injectable()
            class InvalidState {
                @action()
                public setup(): void {}
            }

            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([]), NgxsDataPluginModule.forRoot()],
                providers: [InvalidState]
            });

            const state: InvalidState = TestBed.get(InvalidState);
            state.setup();
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_DATA_STATE_DECORATOR);
    });

    it('should be correct mutate metadata', () => {
        @StateRepository()
        @State({ name: 'a', defaults: 'a' })
        @Injectable()
        class A extends NgxsDataRepository<string> {
            @action()
            public setup(): string {
                return this.getState();
            }
        }

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([A]), NgxsDataPluginModule.forRoot()]
        });

        const stateA: A = TestBed.get(A);

        expect(getRepository(A)).toEqual({
            stateMeta: {
                name: 'a',
                actions: {},
                defaults: 'a',
                path: 'a',
                makeRootSelector: expect.any(Function),
                children: undefined
            },
            stateClass: A,
            operations: {}
        });

        expect(stateA.setup()).toEqual('a');

        expect(getRepository(A)).toEqual({
            stateMeta: {
                name: 'a',
                actions: {
                    '@a.setup()': [
                        {
                            type: '@a.setup()',
                            options: {
                                cancelUncompleted: true
                            },
                            fn: '@a.setup()'
                        }
                    ]
                },
                makeRootSelector: expect.any(Function),
                defaults: 'a',
                path: 'a'
            },
            stateClass: A,
            operations: {
                setup: {
                    type: '@a.setup()',
                    argumentsNames: [],
                    options: {
                        cancelUncompleted: true
                    }
                }
            }
        });
    });

    describe('Complex inheritance', () => {
        @StateRepository()
        @State({ name: 'a', defaults: 'a' })
        @Injectable()
        class A extends NgxsDataRepository<string> {
            // noinspection JSUnusedGlobalSymbols
            protected word: string = 'hello';

            @action()
            public a(): string {
                return this.getState();
            }

            @action()
            public withValueSetStateAsAction(name: string): string {
                this.setState('new value - ' + this.word + ' - ' + this.name + ' - ' + name);
                return this.getState();
            }

            // noinspection JSUnusedGlobalSymbols
            public withValueSetStateAsMethod(name: string): string {
                this.setState('new value as method - ' + this.word + ' - ' + this.name + ' - ' + name);
                return this.getState();
            }
        }

        @StateRepository()
        @State({ name: 'b', defaults: 'b' })
        @Injectable()
        class B extends A {
            @action()
            public b(): string {
                return this.getState();
            }

            // noinspection JSUnusedGlobalSymbols
            public superA(): string {
                return super.a() + super.word;
            }

            // noinspection JSUnusedGlobalSymbols
            public thisB(): string {
                return this.a() + this.word;
            }
        }

        @StateRepository()
        @State({ name: 'c', defaults: 'c' })
        @Injectable()
        class C extends B {
            @action()
            public b(): string {
                return this.getState();
            }

            public superA(): string {
                return super.superA();
            }

            // noinspection JSUnusedGlobalSymbols
            public thisA(): string {
                return this.thisB();
            }
        }

        let stateA: A;
        let stateB: B;
        let stateC: C;

        beforeAll(() => {
            TestBed.configureTestingModule({
                imports: [NgxsModule.forRoot([A, B, C]), NgxsDataPluginModule.forRoot()]
            });

            stateA = TestBed.get(A);
            stateB = TestBed.get(B);
            stateC = TestBed.get(C);
        });

        it('should be correct metadata before invoked actions', () => {
            expect(getRepository(A)).toEqual({
                stateMeta: {
                    name: 'a',
                    actions: {},
                    defaults: 'a',
                    makeRootSelector: expect.any(Function),
                    path: 'a'
                },
                operations: {},
                stateClass: A
            });

            expect(getRepository(B)).toEqual({
                stateMeta: {
                    name: 'b',
                    actions: {},
                    defaults: 'b',
                    makeRootSelector: expect.any(Function),
                    path: 'b'
                },
                operations: {},
                stateClass: B
            });

            expect(getRepository(C)).toEqual({
                stateMeta: {
                    name: 'c',
                    actions: {},
                    defaults: 'c',
                    makeRootSelector: expect.any(Function),
                    path: 'c'
                },
                operations: {},
                stateClass: C
            });
        });

        it('should be prepare metadata after invoke first action', () => {
            expect(stateA.a()).toEqual('a');
            expect(stateB.a()).toEqual('b');
            expect(stateC.a()).toEqual('c');

            expect(getRepository(A)).toEqual({
                stateMeta: {
                    name: 'a',
                    actions: {
                        '@a.a()': [
                            {
                                type: '@a.a()',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@a.a()'
                            }
                        ]
                    },
                    makeRootSelector: expect.any(Function),
                    defaults: 'a',
                    path: 'a'
                },
                stateClass: A,
                operations: {
                    a: {
                        type: '@a.a()',
                        argumentsNames: [],
                        options: {
                            cancelUncompleted: true
                        }
                    }
                }
            });

            expect(getRepository(B)).toEqual({
                stateMeta: {
                    name: 'b',
                    actions: {
                        '@b.a()': [
                            {
                                type: '@b.a()',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@b.a()'
                            }
                        ]
                    },
                    makeRootSelector: expect.any(Function),
                    defaults: 'b',
                    path: 'b'
                },
                stateClass: B,
                operations: {
                    a: {
                        type: '@b.a()',
                        argumentsNames: [],
                        options: {
                            cancelUncompleted: true
                        }
                    }
                }
            });

            expect(getRepository(C)).toEqual({
                stateMeta: {
                    name: 'c',
                    actions: {
                        '@c.a()': [
                            {
                                type: '@c.a()',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@c.a()'
                            }
                        ]
                    },
                    makeRootSelector: expect.any(Function),
                    defaults: 'c',
                    path: 'c'
                },
                stateClass: C,
                operations: {
                    a: {
                        type: '@c.a()',
                        argumentsNames: [],
                        options: {
                            cancelUncompleted: true
                        }
                    }
                }
            });
        });

        it('super !== this', () => {
            // noinspection SpellCheckingInspection
            expect(stateB.superA()).toEqual('bundefined');
            // noinspection SpellCheckingInspection
            expect(stateC.superA()).toEqual('cundefined');

            // noinspection SpellCheckingInspection
            expect(stateB.thisB()).toEqual('bhello');
            // noinspection SpellCheckingInspection
            expect(stateC.thisA()).toEqual('chello');
        });

        it('detect problem with invoke action into action', () => {
            // A
            expect(stateA.withValueSetStateAsAction('LEONARD')).toEqual('a');
            expect(stateA.getState()).toEqual('new value - hello - a - LEONARD');
            stateA.reset();
            expect(stateA.getState()).toEqual('a');
            expect(stateA.withValueSetStateAsMethod('LEONARD')).toEqual('new value as method - hello - a - LEONARD');
            expect(stateA.getState()).toEqual('new value as method - hello - a - LEONARD');

            // B
            expect(stateB.withValueSetStateAsAction('SHELDON')).toEqual('b');
            expect(stateB.getState()).toEqual('new value - hello - b - SHELDON');
            stateB.reset();
            expect(stateB.getState()).toEqual('b');
            expect(stateB.withValueSetStateAsMethod('SHELDON')).toEqual('new value as method - hello - b - SHELDON');
            expect(stateB.getState()).toEqual('new value as method - hello - b - SHELDON');

            // C
            expect(stateC.withValueSetStateAsAction('HOWARD')).toEqual('c');
            expect(stateC.getState()).toEqual('new value - hello - c - HOWARD');
            stateC.reset();
            expect(stateC.getState()).toEqual('c');
            expect(stateC.withValueSetStateAsMethod('HOWARD')).toEqual('new value as method - hello - c - HOWARD');
            expect(stateC.getState()).toEqual('new value as method - hello - c - HOWARD');

            expect(getRepository(A)).toEqual({
                stateMeta: {
                    name: 'a',
                    actions: {
                        '@a.withValueSetStateAsAction(name)': [
                            {
                                type: '@a.withValueSetStateAsAction(name)',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@a.withValueSetStateAsAction(name)'
                            }
                        ],
                        '@a.a()': [
                            {
                                type: '@a.a()',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@a.a()'
                            }
                        ],
                        '@a.setState(stateValue)': [
                            {
                                type: '@a.setState(stateValue)',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@a.setState(stateValue)'
                            }
                        ],
                        '@a.reset()': [
                            {
                                type: '@a.reset()',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@a.reset()'
                            }
                        ]
                    },
                    makeRootSelector: expect.any(Function),
                    defaults: 'a',
                    path: 'a'
                },
                stateClass: A,
                operations: {
                    withValueSetStateAsAction: {
                        type: '@a.withValueSetStateAsAction(name)',
                        argumentsNames: ['name'],
                        options: {
                            cancelUncompleted: true
                        }
                    },
                    setState: {
                        type: '@a.setState(stateValue)',
                        argumentsNames: ['stateValue'],
                        options: {
                            cancelUncompleted: true
                        }
                    },
                    a: {
                        type: '@a.a()',
                        argumentsNames: [],
                        options: {
                            cancelUncompleted: true
                        }
                    },
                    reset: {
                        type: '@a.reset()',
                        argumentsNames: [],
                        options: {
                            cancelUncompleted: true
                        }
                    }
                }
            });

            expect(getRepository(B)).toEqual({
                stateMeta: {
                    name: 'b',
                    actions: {
                        '@b.withValueSetStateAsAction(name)': [
                            {
                                type: '@b.withValueSetStateAsAction(name)',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@b.withValueSetStateAsAction(name)'
                            }
                        ],
                        '@b.setState(stateValue)': [
                            {
                                type: '@b.setState(stateValue)',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@b.setState(stateValue)'
                            }
                        ],
                        '@b.a()': [
                            {
                                type: '@b.a()',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@b.a()'
                            }
                        ],
                        '@b.reset()': [
                            {
                                type: '@b.reset()',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@b.reset()'
                            }
                        ]
                    },
                    makeRootSelector: expect.any(Function),
                    defaults: 'b',
                    path: 'b'
                },
                stateClass: B,
                operations: {
                    withValueSetStateAsAction: {
                        type: '@b.withValueSetStateAsAction(name)',
                        argumentsNames: ['name'],
                        options: {
                            cancelUncompleted: true
                        }
                    },
                    setState: {
                        type: '@b.setState(stateValue)',
                        argumentsNames: ['stateValue'],
                        options: {
                            cancelUncompleted: true
                        }
                    },
                    a: {
                        type: '@b.a()',
                        argumentsNames: [],
                        options: {
                            cancelUncompleted: true
                        }
                    },
                    reset: {
                        type: '@b.reset()',
                        argumentsNames: [],
                        options: {
                            cancelUncompleted: true
                        }
                    }
                }
            });

            expect(getRepository(C)).toEqual({
                stateMeta: {
                    name: 'c',
                    actions: {
                        '@c.withValueSetStateAsAction(name)': [
                            {
                                type: '@c.withValueSetStateAsAction(name)',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@c.withValueSetStateAsAction(name)'
                            }
                        ],
                        '@c.setState(stateValue)': [
                            {
                                type: '@c.setState(stateValue)',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@c.setState(stateValue)'
                            }
                        ],
                        '@c.a()': [
                            {
                                type: '@c.a()',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@c.a()'
                            }
                        ],
                        '@c.reset()': [
                            {
                                type: '@c.reset()',
                                options: {
                                    cancelUncompleted: true
                                },
                                fn: '@c.reset()'
                            }
                        ]
                    },
                    makeRootSelector: expect.any(Function),
                    defaults: 'c',
                    path: 'c'
                },
                stateClass: C,
                operations: {
                    withValueSetStateAsAction: {
                        type: '@c.withValueSetStateAsAction(name)',
                        argumentsNames: ['name'],
                        options: {
                            cancelUncompleted: true
                        }
                    },
                    setState: {
                        type: '@c.setState(stateValue)',
                        argumentsNames: ['stateValue'],
                        options: {
                            cancelUncompleted: true
                        }
                    },
                    a: {
                        type: '@c.a()',
                        argumentsNames: [],
                        options: {
                            cancelUncompleted: true
                        }
                    },
                    reset: {
                        type: '@c.reset()',
                        argumentsNames: [],
                        options: {
                            cancelUncompleted: true
                        }
                    }
                }
            });
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });
});
