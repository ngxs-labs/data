import { ModuleWithProviders, NgModule, Self } from '@angular/core';
import { NgxsDataAccessor } from './services/data-access-injector.service';

@NgModule()
export class NgxsDataPluginModule {
  constructor(@Self() public accessor: NgxsDataAccessor) {}

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxsDataPluginModule,
      providers: [NgxsDataAccessor]
    };
  }
}
