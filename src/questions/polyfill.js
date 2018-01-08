import promisify from 'es6-promisify';
import fs from 'fs';
import path from 'path';
import replace from 'replace-in-file';
import { GENERATOR_TYPES } from '../constants';
import { store } from '../createStore';
import addRazzleMod from '../services/addRazzleMod';
import log from '../services/log';
import run from '../services/run';
import { errors } from '../snippets';

const rm = promisify(fs.unlink);

export default {
    type: 'confirm',
    name: 'polyfill',
    message: 'Use babel-polyfill? (adds IE support) (https://babeljs.io/docs/usage/polyfill/)',
    when: ({ mobile }) => !mobile,
};

export const execute = async ({ answer, answers: { ssr, appname, eslintConfig }, packages }) => {
    const { generator } = store.getState();
    // TODO if on git repo eject fails because project was just added
    // TODO this should not happen normally though since this is structure of having multiple projects in 1
    // TODO repo is not normal.
    if (generator === GENERATOR_TYPES.razzle) {
        packages.push('oberon-razzle-modifications');
        await addRazzleMod(appname);
        await replace({
            from: /const usePolyfill = false;/,
            to: 'const usePolyfill = true;',
            files: path.join(process.cwd(), appname, 'razzle.config.js'),
        });
    } else {
        if (eslintConfig === 'react-app') {
            log(errors.ejectCRA, 'warn');
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
};
