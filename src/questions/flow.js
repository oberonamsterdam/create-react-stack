/* eslint-disable no-console */
import path from 'path';
import { GENERATOR_TYPES, PROMISIFIED_METHODS } from '../globals/constants';
import { flowReactNative } from '../globals/snippets';
import log from '../services/log';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'flow',
    message: 'Use flow? (http://flow.org)',
};

export class FlowExecute extends BaseQuestion {
    mobile = this.answers.mobile;
    appname = this.answers.appname;

    default = async () => {
        this.devPackages.push('flow-bin');
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
        await this.commands.push(['npx flow-typed install', { cwd: path.join(process.cwd(), this.appname) }]);
    };

    runFlow = async () => {
        console.log();
        log(`👮  Running flow..`);
        console.log();

        await this.commands.push([`node ${path.join('.', 'node_modules', '.bin', 'flow')}`, { cwd: this.dir }]);
    };
}