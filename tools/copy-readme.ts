import { join } from 'path';
import { createReadStream, createWriteStream, existsSync } from 'fs';

import { name } from '../package.json';

function copyReadmeAfterSuccessfulBuild(): void {
    const path = join(__dirname, '../README.md');
    const noReadme = !existsSync(path);

    if (noReadme) {
        return console.log('README.md does not exist on the root level!');
    }

    createReadStream(path)
        .pipe(createWriteStream(join(__dirname, `../dist/${name}/README.md`)))
        .on('finish', () => {
            console.log(`Successfully copied README.md into dist/${name} folder!`);
        });
}

copyReadmeAfterSuccessfulBuild();
