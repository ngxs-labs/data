import { Injector, ModuleWithProviders, NgModule } from "@angular/core";
import {
  ɵq as StateContextFactory,
  ɵn as StateFactory,
  Store
} from "@ngxs/store";

@NgModule()
export class NgxsDataPluginModule {
  public static contextFactory: StateContextFactory | null = null;
  public static stateFactory: StateFactory | null = null;
  public static store: Store | null = null;

  constructor(private injector: Injector) {
    NgxsDataPluginModule.store = injector.get<Store>(Store);
    NgxsDataPluginModule.contextFactory = injector.get<StateContextFactory>(
      StateContextFactory
    );

    NgxsDataPluginModule.stateFactory = injector.get<StateFactory>(
      StateFactory
    );
  }

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxsDataPluginModule,
      providers: []
    };
  }
}
