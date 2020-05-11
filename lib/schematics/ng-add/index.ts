import { branchAndMerge, chain, Rule } from '@angular-devkit/schematics';

import { NgxsDataSchematicsOptions } from '../symbols';
import { Logger } from '../utils/logger';
import { addDeclarationToAppModule } from './src/add-module-to-imports';
import { addNgxsPackages } from './src/add-ngxs-packages';
import { runNpmPackageInstall } from './src/run-npm-install';

export function ngAdd(options: NgxsDataSchematicsOptions): Rule {
    const logger: Logger = new Logger();

    return chain([
        addNgxsPackages(logger),
        runNpmPackageInstall(logger),
        branchAndMerge(addDeclarationToAppModule(options.appModulePath ?? './src/app/app.module.ts', logger))
    ]);
}
