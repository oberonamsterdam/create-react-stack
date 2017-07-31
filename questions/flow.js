import run from '../services/run';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';

export default {
    type: 'confirm',
    name: 'flow',
    message: 'Use flow? (http://flow.org)',
};

export const execute = async (answer, answers, packages, devPackages) => {
    if(answer) {
        devPackages.push('flow-bin');
    }
};

export const postInstall = async (answer, { appname }) => {
    if(!answer) {
        return;
    }

    await run('npx flow init', {
        cwd: path.join(process.cwd(), appname)
    });

    const { flowTyped } = await inquirer.prompt([{
        type: 'confirm',
        name: 'flowTyped',
        message: chalk`{bold Run {dim flow-typed} now? (will automatically type all your dependencies)}`
    }]);
    
    if(flowTyped) {
        await run('npx flow-typed install', {
            cwd: path.join(process.cwd(), appname)
        });
    }
}