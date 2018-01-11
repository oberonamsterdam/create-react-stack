import path from 'path';
import { GENERATOR_TYPES, PROMISIFIED_METHODS } from '../globals/constants';
import { flowReactNative } from '../globals/snippets';
import log from '../services/log';
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
        this.dir = path.join(process.cwd(), this.appname);
    }

    default = async () => {
        this.devPackages.push('flow-bin@0.56.0');
    };

    onPostInstall = async () => {
        if (this.state.generator === GENERATOR_TYPES.reactNative) {
            const { rm, writeFile } = PROMISIFIED_METHODS;
            // remove .flowconfig added by expo
            await rm(path.join(this.dir, '.flowconfig'));

            // add our custom .flowconfig
            await writeFile(path.join(this.dir, '.flowconfig'), flowReactNative.flowConfig);

            // run flow-typed by default to avoid flow throwing errors on undeclared modules
            await this.runFlowTyped();

            // add react-native type declaration (and other type declaration if needed).
            await writeFile(path.join(this.dir, 'flow-typed', 'npm', 'index.js'), flowReactNative.flowTyped);
        } else {
            await this.runFlowTyped();
        }
        await this.runFlow();
    };

    runFlowTyped = async () => {
        // automatically type dependencies to avoid flow throwing errors on startup
        await run('npx flow-typed install', {
            cwd: path.join(process.cwd(), this.appname),
        });
    };

    runFlow = async () => {
        console.log();
        log(`👮  Running flow..`);
        console.log();

        await run(`node ${path.join('.', 'node_modules', '.bin', 'flow')}`, {
            cwd: this.dir,
        });
    };
}