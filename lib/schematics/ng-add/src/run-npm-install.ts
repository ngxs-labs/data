import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { Logger } from '../../utils/logger';

export function runNpmPackageInstall(logger: Logger): Rule {
    return (tree: Tree, context: SchematicContext): Tree => {
        context.addTask(new NodePackageInstallTask());
        logger.log(`Installing packages...`);
        return tree;
    };
}
