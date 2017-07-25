import chalk from 'chalk';
import path from 'path';
import run from '../services/run';
import replace from 'replace-in-file';

export default {
    type: 'confirm',
    name: 'eslint',
    message: chalk`{bold Use eslint with custom {dim eslint-config-oberon}? (http://eslint.js.org/)}`
};

export const execute = async (answer, { ssr, appname }) => {
    if(answer) {
        await run('npm install eslint-config-oberon', {
            cwd: path.join(process.cwd(), appname)
        });
        if(ssr) {
            // todo add webpack loader for razzle
        } else {
            await replace({
                files: path.join(process.cwd(), appname, 'package.json'),
                from: /"extends": "react-app"/g,
                to: '"extends": "oberon"'
            });
        }
    }
};