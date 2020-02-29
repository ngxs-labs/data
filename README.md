<p align="center">
  <img src="https://raw.githubusercontent.com/ngxs/store/master/docs/assets/logo.png">
  <br />
  <b>NGXS Persistence API (@ngxs-labs/data)</b> <br />
  <b>🚀 See it in action on <a href="https://stackblitz.com/edit/ngxs-labs-data">Stackblitz</a></b>
  <br />
</p>
  
<p align="center">
  
  <a href="https://travis-ci.org/ngxs-labs/data">
    <img src="https://travis-ci.org/ngxs-labs/data.svg?branch=master" />
  </a>
  <a href="https://badge.fury.io/js/%40ngxs-labs%2Fdata">
    <img src="https://badge.fury.io/js/%40ngxs-labs%2Fdata.svg" />
  </a>
  <a href="https://npm-stat.com/charts.html?package=%40ngxs-labs%2Fdata&from=2019-09-01">
    <img src="https://img.shields.io/npm/dt/@ngxs-labs/data.svg" />
  </a>  
  <a href="https://coveralls.io/github/ngxs-labs/data?branch=master">
    <img src="https://coveralls.io/repos/github/ngxs-labs/data/badge.svg?branch=master" />
  </a>
</p>

---

## Introduction

NGXS Persistence API is an extension based the Repository Design Pattern that offers a gentle introduction to NGXS by
simplifying management of entities or plain data while reducing the amount of explicitness.

![](https://habrastorage.org/webt/jd/t4/wo/jdt4woihu-chhiwlqqd4eogpelu.png)

### Key Concepts

The main purpose of this extension is to provide the necessary layer of abstraction for states. Automates the creation
of actions, dispatchers, and selectors for each entity type.

Benefits:

-   Angular-way (service abstraction)
-   Immutable state context out-of-the-box
-   Persistence state out-of-the-box
-   Automatic action naming by service methods
-   Improved debugging (`@payload` by arguments)
-   Automatic type inference for selection
-   Support debounce for throttling dispatch
-   Easy testable states

Minimal peer dependencies:

-   Require minimal `@ngxs/store v3.6.2`
-   Require minimal `TypeScript v3.7.2`

If you are using Angular 8, you can write in the `tsconfig.json`:

```json
{
    "angularCompilerOptions": {
        "disableTypeScriptVersionCheck": true
    },
    "compilerOptions": {}
}
```

### Quick Links

-   ✨ Learn about it on the [docs](./docs/README.md)
-   🚀 See it in action on [Stackblitz](https://stackblitz.io/github/ngxs-labs/data)
-   😎 Checkout the [sample application](./integration)
-   📝 Learn about updates from the [changelog](CHANGELOG.md)
