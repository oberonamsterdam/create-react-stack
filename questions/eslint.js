import chalk from 'chalk';
import path from 'path';
import run from '../services/run';
import replace from 'replace-in-file';
import addRazzleMod from '../services/addRazzleMod';

export default {
    type: 'confirm',
    name: 'eslint',
    message: 'Use ESLint (http://eslint.js.org/)',
    
    // CRA already includes ESLint.
    when: answers => !!answers.ssr
};

export const execute = async (answer, { ssr, appname }) => {
    if(answer) {
        await run('npm install eslint eslint-loader --save-dev', {
            cwd: path.join(process.cwd(), appname)
        });
        await addRazzleMod(appname);
        await replace({
            from: /const useESLint = false;/,
            to: 'const useESLint = true;',
            files: path.join(process.cwd(), appname, 'razzle.config.js')
        });
        
    }
};