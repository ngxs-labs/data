import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { isTrue } from '@angular-ru/common/utils';

import { environment } from './environments/environment';
import { AppModule } from './src/app.module';

if (isTrue(environment.production)) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err: Error): void => console.error(err));
