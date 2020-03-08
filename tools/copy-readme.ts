/* eslint-disable no-console */
import { createReadStream, createWriteStream, existsSync } from 'fs';
import { join } from 'path';

import { name } from '../package.json';

function copyReadmeAfterSuccessfulBuild(): void {
    const path: string = join(__dirname, '../README.md');
    const noReadme: boolean = !existsSync(path);

    if (noReadme) {
        return console.log('README.md does not exist on the root level!');
    }

    createReadStream(path)
        .pipe(createWriteStream(join(__dirname, `../dist/${name}/README.md`)))
        .on('finish', (): void => {
            console.log(`Successfully copied README.md into dist/${name} folder!`);
        });
}

copyReadmeAfterSuccessfulBuild();
