import globby from 'globby';
import fs from 'fs';
import promisify from 'es6-promisify';
import { join } from 'path';

const readFile = promisify(fs.readFile);

export const createDirectorySnapshot = async (directory) => {
    // todo read .gitignore instead of hardcoded negations
    const paths = await globby(['*/**', '!node_modules/**'], {
        nodir: true,
        cwd: directory
    });
    const contents = await Promise.all(
        paths.map(
            path => readFile(join(directory, path), {
                encoding: 'utf8'
            })
        )
    );
    return contents
        .map((content, index) => ({
            [paths[index]]: content
        }))
        .reduce((a, b) => Object.assign(a, b), {});
};