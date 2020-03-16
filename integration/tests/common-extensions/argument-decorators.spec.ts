/* eslint-disable */
import { Injectable } from '@angular/core';
import { NgxsModule, State } from '@ngxs/store';
import { action, named, payload, StateRepository } from '@ngxs-labs/data/decorators';
import { TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsImmutableDataRepository } from '@ngxs-labs/data/repositories';
import { getRepository } from '@ngxs-labs/data/internals';
import { NgxsRepositoryMeta } from '@ngxs-labs/data/typings';
import { NGXS_DATA_EXCEPTIONS } from '@ngxs-labs/data/tokens';

describe('[TEST]: Argument decorators', () => {
    it('should be correct ensure meta from A', () => {
        @StateRepository()
        @State({ name: 'a', defaults: '' })
        @Injectable()
        class A extends NgxsImmutableDataRepository<string> {}

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([A]), NgxsDataPluginModule.forRoot()]
        });

        const a: A = TestBed.get<A>(A);

        a.setState('1');

        const repo: NgxsRepositoryMeta = getRepository(A);
        expect(repo.stateMeta?.actions).toEqual({
            '@a.setState(stateValue)': [
                {
                    type: '@a.setState(stateValue)',
                    options: { cancelUncompleted: true },
                    fn: '@a.setState(stateValue)'
                }
            ]
        });

        expect(a.getState()).toEqual('1');
    });

    it('should be correct ensure meta from B', () => {
        @StateRepository()
        @State({ name: 'b', defaults: '' })
        @Injectable()
        class B extends NgxsImmutableDataRepository<string> {
            @action()
            public set(val: string, plus: string = '3'): void {
                this.ctx.setState(`${val}${plus}`);
            }
        }

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([B]), NgxsDataPluginModule.forRoot()]
        });

        const b: B = TestBed.get<B>(B);

        b.set('2');

        const repo: NgxsRepositoryMeta = getRepository(B);
        expect(repo.stateMeta?.actions).toEqual({
            '@b.set($arg0, $arg1)': [
                {
                    type: '@b.set($arg0, $arg1)',
                    options: { cancelUncompleted: true },
                    fn: '@b.set($arg0, $arg1)'
                }
            ]
        });

        expect(b.getState()).toEqual('23');
    });

    it('should be correct ensure meta from C', () => {
        @StateRepository()
        @State({ name: 'c', defaults: '' })
        @Injectable()
        class C extends NgxsImmutableDataRepository<string> {
            @action()
            public set(@named('val') val: string, @named('plus') plus: string = '3'): void {
                this.ctx.setState(`${val}${plus}`);
            }
        }

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([C]), NgxsDataPluginModule.forRoot()]
        });

        const c: C = TestBed.get<C>(C);

        c.set('4', '10');

        const repo: NgxsRepositoryMeta = getRepository(C);
        expect(repo.stateMeta?.actions).toEqual({
            '@c.set(val, plus)': [
                {
                    type: '@c.set(val, plus)',
                    options: { cancelUncompleted: true },
                    fn: '@c.set(val, plus)'
                }
            ]
        });

        expect(c.getState()).toEqual('410');
    });

    it('should be correct ensure meta from D', () => {
        @StateRepository()
        @State({ name: 'd', defaults: '' })
        @Injectable()
        class D extends NgxsImmutableDataRepository<string> {
            @action()
            public set(@payload('X') x?: string, @payload(' Y ') @named(' y ') y?: string, z?: string): void {
                this.ctx.setState(`${x}${y}${z}`);
            }
        }

        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([D]), NgxsDataPluginModule.forRoot()]
        });

        const d: D = TestBed.get<D>(D);

        d.set('1', '2', '3');

        const repo: NgxsRepositoryMeta = getRepository(D);
        expect(repo.stateMeta?.actions).toEqual({
            '@d.set(X, y, $arg2)': [
                {
                    type: '@d.set(X, y, $arg2)',
                    options: { cancelUncompleted: true },
                    fn: '@d.set(X, y, $arg2)'
                }
            ]
        });

        expect(d.getState()).toEqual('123');
    });

    it('should be invalid payload', () => {
        let message: string | null = null;

        try {
            @StateRepository()
            @State({ name: 'e', defaults: '' })
            @Injectable()
            class E extends NgxsImmutableDataRepository<string> {
                @action()
                public setX(@payload('') x?: string): void {
                    this.ctx.setState(`${x}`);
                }
            }

            new E().setX();
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_INVALID_PAYLOAD_NAME);
    });

    it('should be invalid argument', () => {
        let message: string | null = null;

        try {
            @StateRepository()
            @State({ name: 'g', defaults: '' })
            @Injectable()
            class G extends NgxsImmutableDataRepository<string> {
                @action()
                public setY(@named('') y?: string): void {
                    this.ctx.setState(`${y}`);
                }
            }

            new G().setY();
        } catch (e) {
            message = e.message;
        }

        expect(message).toEqual(NGXS_DATA_EXCEPTIONS.NGXS_INVALID_ARG_NAME);
    });

    describe('check duplicate name', () => {
        it('should be duplicate argument name', () => {
            let message: string | null = null;

            try {
                @StateRepository()
                @State({ name: 'g', defaults: '' })
                @Injectable()
                class G extends NgxsImmutableDataRepository<string> {
                    @action()
                    public setYZ(@named('y') y?: string, @named('y') z?: string): void {
                        this.ctx.setState(`${y}`);
                    }
                }

                new G().setYZ();
            } catch (e) {
                message = e.message;
            }

            expect(message).toEqual("An argument with the name 'y' already exists in the method 'setYZ'");
        });

        it('should be duplicate payload name', () => {
            let message: string | null = null;

            try {
                @StateRepository()
                @State({ name: 'g', defaults: '' })
                @Injectable()
                class G extends NgxsImmutableDataRepository<string> {
                    @action()
                    public setYZ(@payload('y') y?: string, @payload('y') z?: string): void {
                        this.ctx.setState(`${y}`);
                    }
                }

                new G().setYZ();
            } catch (e) {
                message = e.message;
            }

            expect(message).toEqual("An argument with the name 'y' already exists in the method 'setYZ'");
        });

        it('should be duplicate payload name as argument name', () => {
            let message: string | null = null;

            try {
                @StateRepository()
                @State({ name: 'g', defaults: '' })
                @Injectable()
                class G extends NgxsImmutableDataRepository<string> {
                    @action()
                    public setYZ(@payload('y') y?: string, @named('y') z?: string): void {
                        this.ctx.setState(`${y}`);
                    }
                }

                new G().setYZ();
            } catch (e) {
                message = e.message;
            }

            expect(message).toEqual("An argument with the name 'y' already exists in the method 'setYZ'");
        });
    });
});
