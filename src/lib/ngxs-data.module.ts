import { ModuleWithProviders, NgModule, Self } from '@angular/core';
import { NgxsDataAccessor } from './services/data-access-injector.service';
import { NgxsDataOptions } from './interfaces/external.interface';

@NgModule()
export class NgxsDataPluginModule {
  constructor(@Self() public accessor: NgxsDataAccessor) {}

  public static forRoot(options: NgxsDataOptions = {}): ModuleWithProviders {
    NgxsDataAccessor.factoryRef = options.factory || null;
    NgxsDataAccessor.contextRef = options.context || null;

    return {
      ngModule: NgxsDataPluginModule,
      providers: [NgxsDataAccessor]
    };
  }
}
