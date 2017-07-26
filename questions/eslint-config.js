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

export const execute = async (answer, { ssr, appname }) => {
    await run(`npm install eslint-config-${answer ? 'oberon' : 'standard'} --save-dev`, {
        cwd: path.join(process.cwd(), appname)
    });
    
    if (answer && !ssr) {
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
        await run(`npm install babel-eslint --save-dev`, {
            cwd: path.join(process.cwd(), appname)
        });
    }
    
    if(ssr) {        
        await writeFile(path.join(process.cwd(), appname, '.eslintrc'), `
{
    "extends": "${answer ? 'oberon' : 'standard'}"
}
`);
    }
};

export const postInstall = async (answer, { appname }) => {
    if(answer) {
        await run('npx eslint --fix src/components', {
            cwd: path.join(process.cwd(), appname)
        });
    }
}