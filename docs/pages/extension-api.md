## Extension API

```ts
import { NgxsDataPluginModule } from '@ngxs-labs/data';
// ..

@NgModule({
    imports: [
        NgxsDataPluginModule.forRoot([
            MY_FIRST_EXTENSION,
            MY_SECOND_EXTENSION,
            MY_THIRD_EXTENSION,
            MY_FOURTH_EXTENSION,
            MY_FIFTH_EXTENSION
        ])
    ]
})
export class AppModule {}
```

`my-extensions.ts` - you can define any providers in your module:

```ts
import { NgxsDataExtension } from '@ngxs-labs/data/typings';
// ..

export const MY_FIRST_EXTENSION: NgxsDataExtension = {
    provide: NGXS_PLUGINS,
    useClass: MySuperService,
    multi: true
};

export const MY_SECOND_EXTENSION: NgxsDataExtension = [
    {
        provide: NGXS_PLUGINS,
        useClass: FeatureService,
        multi: true
    },
    {
        provide: MyInjectableToken,
        useFactory: (): MyFactory => new MyFactory()
    }
];

export const MY_THIRD_EXTENSION: NgxsDataExtension = [MySuperPluginA.forRoot(), MySuperPluginB.forRoot()];

export const MY_FOURTH_EXTENSION: NgxsDataExtension = MyInjectableService;

export const MY_FIFTH_EXTENSION: NgxsDataExtension = {
    provide: MY_TOKEN,
    useValue: 'VALUE'
};
```
