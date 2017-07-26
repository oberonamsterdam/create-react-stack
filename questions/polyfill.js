import chalk from 'chalk';
import path from 'path';
import run from '../services/run';
import replace from 'replace-in-file';
import addRazzleMod from '../services/addRazzleMod';

export default {
    type: 'confirm',
    name: 'polyfill',
    message: 'Use babel-polyfill? (adds IE support) (https://babeljs.io/docs/usage/polyfill/)',
};

export const execute = async (answer, { ssr, appname, eslint }) => {
    if(answer) {
        if(ssr) {
            if(!eslint) {
                // no eslint, razzle mod still needs to be added
                await addRazzleMod(appname);
            }
            await replace({
                from: /const usePolyfill = false;/,
                to: 'const usePolyfill = true;',
                files: path.join(process.cwd(), appname, 'razzle.config.js')
            })
        } else {
            // todo modify webpack.config.dev & webpack.config.prod to replace '../polyfills' with babel-polyfill and remove polyfills file
        }

        await run('npm install babel-polyfill --save-dev', {
            cwd: path.join(process.cwd(), appname)
        });
    }
    
};