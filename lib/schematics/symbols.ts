import { Any } from '@angular-ru/common/typings';
import { NodeDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies';

const { execSync }: Any = require('child_process');

function getVersion(name: string): string {
    const version: string = execSync(`npm show ${name} version --dry-run --loglevel=silent`)?.toString()?.trim();
    return `~${version}`;
}

export const NGXS_PACKAGES: NodeDependency[] = [
    {
        version: getVersion('@ngxs/store'),
        type: NodeDependencyType.Default,
        name: `@ngxs/store`,
        overwrite: true
    },
    {
        version: getVersion('@ngxs-labs/data'),
        type: NodeDependencyType.Default,
        name: `@ngxs-labs/data`,
        overwrite: true
    },
    {
        version: getVersion('@ngxs/logger-plugin'),
        type: NodeDependencyType.Dev,
        name: `@ngxs/logger-plugin`,
        overwrite: true
    }
];

export interface NgxsDataSchematicsOptions {
    appModulePath?: string;
}
