import path from 'path';
import replace from 'replace-in-file';
import addRazzleMod from '../services/addRazzleMod';

export default {
    type: 'confirm',
    name: 'eslint',
    message: 'Use ESLint (http://eslint.js.org/)',
    
    // CRA already includes ESLint.
    when: answers => !!answers.ssr
};

export const execute = async (answer, { ssr, appname }, _, devPackages) => {
    if(answer) {
        devPackages.push('eslint', 'eslint-loader');
        await addRazzleMod(appname);
        await replace({
            from: /const useESLint = false;/,
            to: 'const useESLint = true;',
            files: path.join(process.cwd(), appname, 'razzle.config.js')
        });
        
    }
};