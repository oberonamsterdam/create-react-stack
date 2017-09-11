import path from 'path';
import replace from 'replace-in-file';
import addRazzleMod from '../services/addRazzleMod';
import log from '../services/log';
import run from '../services/run';
import chalk from 'chalk';
import promisify from 'es6-promisify';
import fs from 'fs';

const rm = promisify(fs.unlink);

export default {
    type: 'confirm',
    name: 'polyfill',
    message: 'Use babel-polyfill? (adds IE support) (https://babeljs.io/docs/usage/polyfill/)',
    when: ({ mobile }) => !mobile,
};

export const execute = async (answer, { ssr, appname, eslint, eslintConfig }, packages) => {
    if (answer) {
        if (ssr) {
            if (!eslint) {
                // no eslint, razzle mod still needs to be added
                packages.push('oberon-razzle-modifications');
                await addRazzleMod(appname);
            }
            await replace({
                from: /const usePolyfill = false;/,
                to: 'const usePolyfill = true;',
                files: path.join(process.cwd(), appname, 'razzle.config.js'),
            });
        } else {
            if (!eslintConfig) {
                log(chalk`You indicated that you wanted to use {dim babel-polyfill} instead of the default polyfill. This requires ejecting from {dim create-react-app}, it will prompt you now.`, 'warn');
                await run('npm run eject', {
                    cwd: path.join(process.cwd(), appname),
                });
            }
            await replace({
                from: /require\.resolve\('.\/polyfills'\)/g,
                to: 'require.resolve(\'babel-polyfill\')',
                files: ['webpack.config.dev.js', 'webpack.config.prod.js'].map(config => path.join(process.cwd(), appname, 'config', config)),
            });
            await rm(path.join(process.cwd(), appname, 'config', 'polyfills.js'));
        }

        packages.push('babel-polyfill');
    }
};