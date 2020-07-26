import { Any } from '@angular-ru/common/typings';
import { SchemaMetadata, Type } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { getStateMetadata } from '@ngxs-labs/data/internals';
import { Store } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';

import { TestSpec } from './internal/types';
import { NgxsDataTestingModule } from './ngxs-data-testing.module';
import { resetPlatformAfterBootstrapping } from './reset-platform-after-bootrapping';

/**
 * GENERICS
 * ngxsTestingPlatform({ states: [ ...StateClasses ] }, (store, ...states) => {});
 * ngxsTestingPlatform([ ...StateClasses ], (store, ...states) => {});
 */

export function ngxsTestingPlatform<A>(
    params: (TestModuleMetadata & { states?: [StateClass<A>] }) | [StateClass<A>],
    fn: (store: Store, a: A) => Any
): TestSpec;

export function ngxsTestingPlatform<A, B>(
    params: (TestModuleMetadata & { states?: [StateClass<A>, StateClass<B>] }) | [StateClass<A>, StateClass<B>],
    fn: (store: Store, a: A, b: B) => Any
): TestSpec;

export function ngxsTestingPlatform<A, B, C>(
    params:
        | (TestModuleMetadata & { states?: [StateClass<A>, StateClass<B>, StateClass<C>] })
        | [StateClass<A>, StateClass<B>, StateClass<C>],
    fn: (store: Store, a: A, b: B, c: C) => Any
): TestSpec;

export function ngxsTestingPlatform<A, B, C, D>(
    params:
        | (TestModuleMetadata & { states?: [StateClass<A>, StateClass<B>, StateClass<C>, StateClass<D>] })
        | [StateClass<A>, StateClass<B>, StateClass<C>, StateClass<D>],
    fn: (store: Store, a: A, b: B, c: C, d: D) => Any
): TestSpec;

export function ngxsTestingPlatform<A, B, C, D, E>(
    params:
        | (TestModuleMetadata & {
              states?: [StateClass<A>, StateClass<B>, StateClass<C>, StateClass<D>, StateClass<E>];
          })
        | [StateClass<A>, StateClass<B>, StateClass<C>, StateClass<D>, StateClass<E>],
    fn: (store: Store, a: A, b: B, c: C, d: D, e: E) => Any
): TestSpec;

export function ngxsTestingPlatform<A, B, C, D, E, F>(
    params:
        | (TestModuleMetadata & {
              states?: [StateClass<A>, StateClass<B>, StateClass<C>, StateClass<D>, StateClass<E>, StateClass<F>];
          })
        | [StateClass<A>, StateClass<B>, StateClass<C>, StateClass<D>, StateClass<E>, StateClass<F>],
    fn: (store: Store, a: A, b: B, c: C, d: D, e: E, f: F) => Any
): TestSpec;

export function ngxsTestingPlatform(
    params: TestModuleMetadata & { states?: StateClass[] },
    fn: (store: Store, ...states: StateClass[]) => Any
): TestSpec;

/**
 * PUBLIC API
 */
// eslint-disable-next-line max-lines-per-function
export function ngxsTestingPlatform(
    params: (TestModuleMetadata & { states?: StateClass[] }) | StateClass[],
    fn: (store: Store, ...states: StateClass[]) => Any
): TestSpec {
    // eslint-disable-next-line max-lines-per-function
    return async function testWithNgxsTestingPlatform(this: Any): Promise<void> {
        try {
            const {
                states,
                imports,
                declarations,
                providers,
                aotSummaries,
                schemas
            }: TestModuleMetadata & { states?: StateClass[] } = ensure(params);

            states?.forEach((state: StateClass): void => {
                if (!getStateMetadata(state)) {
                    throw new Error(`${state.name} class must be decorated with @State() decorator`);
                }
            });

            await TestBed.configureTestingModule({
                schemas,
                providers,
                declarations,
                aotSummaries,
                imports: [NgxsDataTestingModule.forRoot(states), ...imports!]
            }).compileComponents();

            NgxsDataTestingModule.ngxsInitPlatform();

            const store: Store = TestBed.get(Store);
            const injectedStates: StateClass[] =
                states?.map((state: StateClass): StateClass => TestBed.get(state)) ?? [];

            return await fn.apply(this, [store, ...injectedStates]);
        } finally {
            resetPlatformAfterBootstrapping();
        }
    };
}

// eslint-disable-next-line complexity,max-lines-per-function
function ensure(
    options: (TestModuleMetadata & { states?: StateClass[] }) | StateClass[]
): TestModuleMetadata & { states?: StateClass[] } {
    let states: StateClass[] = [];
    let providers: Type<unknown>[] = [];
    let declarations: Type<unknown>[] = [];
    let imports: Type<unknown>[] = [];
    let schemas: (SchemaMetadata | Any[])[] = [];
    let aotSummaries: () => Any[] = (): Any[] => [];

    if (Array.isArray(options)) {
        states = options;
    } else {
        states = options?.states ?? [];
        providers = options.providers ?? [];
        declarations = options.declarations ?? [];
        imports = options.imports ?? [];
        schemas = options.schemas ?? [];
        aotSummaries = options.aotSummaries ?? ((): Any[] => []);
    }

    return { states, imports, providers, aotSummaries, declarations, schemas };
}
