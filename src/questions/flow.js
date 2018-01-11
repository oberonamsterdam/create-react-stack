import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import { PROMISIFIED_METHODS } from '../globals/constants';
import run from '../services/run';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'flow',
    message: 'Use flow? (http://flow.org)',
};

export class FlowExecute extends BaseQuestion {
    constructor (data) {
        super(data);
        this.mobile = this.answers.mobile;
        this.appname = this.answers.appname;
    }

    default = async () => {
        this.devPackages.push('flow-bin');
    };

    onPostInstall = async () => {
        // RN includes .flowconfig by default.
        // TODO expo?
        if (!this.answer.flow && this.mobile) {
            await this.removeFlowConfig();
        }
        if (!this.mobile) {
            await run('flow init', {
                cwd: path.join(process.cwd(), this.appname),
            });
        }
        await this.runFlowTyped();
    };

    removeFlowConfig = async () => {
        // react native includes a .flowconfig by default, so we'll delete it.
        // (kind of makes no sense to do so but hey, consistency.)
        await PROMISIFIED_METHODS.rm(path.join(process.cwd(), this.appname, '.flowconfig'));
    };

    runFlowTyped = async () => {
        const { flowTyped } = await inquirer.prompt([{
            type: 'confirm',
            name: 'flowTyped',
            message: chalk`{bold Run {dim flow-typed} now? (will automatically type all your dependencies)}`,
        }]);

        if (flowTyped) {
            await run('npx flow-typed install', {
                cwd: path.join(process.cwd(), this.appname),
            });
        }
    };
}