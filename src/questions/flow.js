import chalk from 'chalk';
import promisify from 'es6-promisify';
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import run from '../services/run';
import BaseQuestion from './BaseQuestion';

const rm = promisify(fs.unlink);

export default {
    type: 'confirm',
    name: 'flow',
    message: 'Use flow? (http://flow.org)',
};

export const execute = async ({ answer, devPackages }) => {
    devPackages.push('flow-bin');
};

export class FlowExecute extends BaseQuestion {
    // TODO extract devPackages / packages for use after running method.
    default = async () => {
        this.devPackages.push();
    };
}

export const postInstall = async ({ answer, answers: { appname, mobile } }) => {
    if (!answer) {
        if (mobile) {
            // react native includes a .flowconfig by default, so we'll delete it. 
            // (kind of makes no sense to do so but hey, consistency.)
            await rm(path.join(process.cwd(), appname, '.flowconfig'));
        }

        return;
    }

    if (!mobile) {
        // TODO breaks atm. command not found: flow
        await run('npx flow init', {
            cwd: path.join(process.cwd(), appname),
        });
    }

    const { flowTyped } = await inquirer.prompt([{
        type: 'confirm',
        name: 'flowTyped',
        message: chalk`{bold Run {dim flow-typed} now? (will automatically type all your dependencies)}`,
    }]);

    if (flowTyped) {
        await run('npx flow-typed install', {
            cwd: path.join(process.cwd(), appname),
        });
    }
};