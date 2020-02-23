## Library architecture

```text
@ngxs/data
├── src
|   └── *.ts
├── public_api.ts
├── package.json
└── common - shared packages for NGXS Data
    ├── src
    |   └── *.ts
    ├── public_api.ts
    └── package.json
└── internals - for internal use only (free API and subject to critical changes)
    ├── src
    |   └── *.ts
    ├── public_api.ts
    └── package.json
```
