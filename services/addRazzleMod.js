import fs from 'fs';
import promisify from 'es6-promisify';
import path from 'path';

const writeFile = promisify(fs.writeFile);

export default async appname => {
    // language=JavaScript
    await writeFile(path.join(process.cwd(), appname, 'razzle.config.js'), `
const useESLint = false;
const usePolyfill = false;

module.exports = {
    modify: require('oberon-razzle-modifications')(useESLint, usePolyfill)
}
    `);
};