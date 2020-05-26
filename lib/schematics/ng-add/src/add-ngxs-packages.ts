import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependency } from '@schematics/angular/utility/dependencies';

import { NGXS_PACKAGES } from '../../symbols';
import { Logger } from '../../utils/logger';

export function addNgxsPackages(logger: Logger): Rule {
    return (tree: Tree, context: SchematicContext): Tree => {
        NGXS_PACKAGES.forEach((dependency: NodeDependency): void => {
            logger.log(`✅️ Add package to ${dependency.type} - ${dependency.name}`, dependency.version);
            addPackageJsonDependency(tree, dependency);
        });

        context.addTask(new NodePackageInstallTask());
        return tree;
    };
}
