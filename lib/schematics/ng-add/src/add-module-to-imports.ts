import { normalize } from '@angular-devkit/core';
import { Path } from '@angular-devkit/core/src/virtual-fs/path';
import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import { UpdateRecorder } from '@angular-devkit/schematics/src/tree/interface';
import { Any } from '@angular-ru/common/typings';
import { addSymbolToNgModuleMetadata } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import * as ts from 'typescript';

import { Logger } from '../../utils/logger';

// eslint-disable-next-line max-lines-per-function
export function addDeclarationToAppModule(appModulePath: string, logger: Logger): Rule {
    // eslint-disable-next-line max-lines-per-function
    return (tree: Tree): Tree => {
        if (!appModulePath) {
            return tree;
        }

        const modulePath: Path = normalize('/' + appModulePath);

        const text: Buffer | null = tree.read(modulePath);

        if (text === null) {
            throw new SchematicsException(`File ${modulePath} does not exist.`);
        }

        const sourceText: string = text.toString('utf-8');
        const source: ts.SourceFile = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);

        const changes: Change[] = addSymbolToNgModuleMetadata(
            source as Any,
            modulePath,
            'imports',
            'NgxsModule.forRoot([])',
            '@ngxs/store'
        );

        changes.push(
            ...addSymbolToNgModuleMetadata(
                source as Any,
                modulePath,
                'imports',
                'NgxsDataPluginModule.forRoot()',
                '@ngxs-labs/data'
            )
        );

        const recorder: UpdateRecorder = tree.beginUpdate(modulePath);
        for (const change of changes) {
            if (change instanceof InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }

        tree.commitUpdate(recorder);

        logger.log('Update AppModule: \n');
        logger.log(tree.read(appModulePath)?.toString());

        return tree;
    };
}
