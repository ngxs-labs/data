import { ngPackagr } from 'ng-packagr';
import { join } from 'path';

async function buildPackage(): Promise<void> {
    try {
        await ngPackagr()
            .forProject(join(__dirname, '../lib/ng-package.json'))
            .withTsConfig(join(__dirname, './tsconfig.lib.json'))
            .build();
    } catch {
        process.exit(1);
    }
}

buildPackage();
