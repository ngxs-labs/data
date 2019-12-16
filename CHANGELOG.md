# 2.0.0 2019-12-11

- Feature: Support TypeScript 3.7
- Feature: Support NGXS 3.6

### BREAKING CHANGES

- Compatible only with NGXS 3.6+
- Now `patchState, setState` return `void`
- No longer support options in `NgxsDataPluginModule.forRoot()`
- No longer support `@query` decorator
