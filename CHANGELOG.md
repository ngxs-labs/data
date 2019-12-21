# 2.1.4 2019-12-21

-   Fix: downgrade typescript for compatibility angular build

# 2.1.0 2019-12-19

-   Feature: storage plugin `out of the box`
-   Fix: dispatch storage when first initial states

# 2.0.0 2019-12-11

-   Feature: Support TypeScript 3.7
-   Feature: Support NGXS 3.6

### BREAKING CHANGES

-   Compatible only with NGXS 3.6+
-   Now `patchState, setState` return `void`
-   No longer support options in `NgxsDataPluginModule.forRoot()`
-   No longer support `@query` decorator
