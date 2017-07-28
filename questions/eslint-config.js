import chalk from 'chalk';
import path from 'path';
import run from '../services/run';
import replace from 'replace-in-file';
import fs from 'fs';
import promisify from 'es6-promisify';
import log from '../services/log';
const writeFile = promisify(fs.writeFile);

export default {
    type: 'confirm',
    name: 'eslintConfig',
    message: chalk`{bold Use {dim eslint-config-oberon}? (https://github.com/oberonamsterdam/eslint-config-oberon)}`,
    when: answers => (answers.ssr && answers.eslint) || !answers.ssr
};

export const execute = async (answer, { ssr, appname }, _, devPackages) => {
    if (answer && !ssr) {
        devPackages.push('eslint-config-oberon');
        // eject if we're on create-react-app.
        log(chalk`You indicated that you wanted to use {dim eslint-config-oberon}. This requires ejecting from {dim create-react-app}, it will prompt you now.`, 'warn');
        await run('npm run eject', {
            cwd: path.join(process.cwd(), appname)
        });
        await replace({
            files: path.join(process.cwd(), appname, 'package.json'),
            from: /"extends": "react-app"/g,
            to: '"extends": "oberon"'
        });
    }
    
    if(answer) {
        // eslint-config-oberon requires babel-eslint to be installed, eslint-config-standard doesn't
        devPackages.push('babel-eslint');
    }
    
    if(ssr) {
        devPackages.push(`eslint-config-${answer ? 'oberon' : 'standard'}`);
        
        if(!answer) {
            devPackages.push('eslint-plugin-standard', 'eslint-plugin-promise', 'eslint-plugin-import', 'eslint-plugin-node');
        }
        
        await writeFile(path.join(process.cwd(), appname, '.eslintrc'), `
{
    "extends": "${answer ? 'oberon' : 'standard'}"
}
`);
    }
};

export const postInstall = async (answer, { appname, ssr, eslint }) => {
    if(ssr && !eslint) {
        return;
    }
    
    // attempt auto fix now that config etc is in place.
    try {
        await run('npx eslint --fix src', {
            cwd: path.join(process.cwd(), appname)
        });
    }
    catch(ex) {
        log('ESLint auto fix failed! Check log above.', 'warn', ex);
    }
}