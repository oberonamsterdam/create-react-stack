import fs from 'fs';
import promisify from 'es6-promisify';
import run from '../services/run';
import path from 'path';
const writeFile = promisify(fs.writeFile);

export default async appname => {
    // await run('npm install oberon-razzle-modifications', {
    await run('npm link oberon-razzle-modifications', {
        cwd: path.join(process.cwd(), appname)
    });
    //language=JavaScript
    await writeFile(path.join(process.cwd(), appname, 'razzle.config.js'), `
        const useESLint = false;
        const usePolyfill = false;

        module.exports = {
            modify: require('oberon-razzle-modifications')(useESLint, usePolyfill)
        }
    `);
};