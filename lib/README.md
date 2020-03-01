## Library architecture

```text
@ngxs/data
├── src
|   └── *.ts
├── public_api.ts
└── storage - Storage Plugin API
|   ├── src
|   |   └── *.ts
|   ├── public_api.ts
|   └── package.json
└── decorators - Decorators API
|   ├── src
|   |   └── *.ts
|   ├── public_api.ts
|   └── package.json
└── repositories - Repositories API (Data, Entity)
|   ├── src
|   |   └── *.ts
|   ├── public_api.ts
|   └── package.json
└── typings - Common interfaces for primary and secondary packages
|   ├── src
|   |   └── *.ts
|   ├── public_api.ts
|   └── package.json
└── tokens - Common constants and tokens
|   ├── src
|   |   └── *.ts
|   ├── public_api.ts
|   └── package.json
└── internals - Internal API (not use for public API)
    ├── src
    |   └── *.ts
    ├── public_api.ts
    └── package.json
```
