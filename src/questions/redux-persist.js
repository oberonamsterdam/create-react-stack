import path from 'path';
import replace from 'replace-in-file';
import { GENERATOR_TYPES, PROMISIFIED_METHODS } from '../globals/constants';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'reduxPersist',
    message: 'Use redux-persist? (https://github.com/rt2zz/redux-persist)',
    // no redux-persist if no redux.
    when: ({ reduxSsr, mobile, redux }) => (!!redux),
};

export class ReduxPersistExecute extends BaseQuestion {
    templateDir = path.join(this.reactNativeTemplate, 'redux-persist');

    constructor (data) {
        super(data);
        this.packages.push('redux-persist');
    }

    razzleAndCRAExecute = async () => {
        this.packages.push('redux-persist');
        this.stripSection = /\s\/\/ @crs-without-persist-start([\s\S]*?)\/\/ @crs-without-persist-end/gm;
        await this.replaceTemplate();
    };

    [GENERATOR_TYPES.razzle] = () => this.razzleAndCRAExecute();
    [GENERATOR_TYPES.createReactApp] = () => this.razzleAndCRAExecute();

    [GENERATOR_TYPES.reactNative] = async () => {
        const { copy } = PROMISIFIED_METHODS;
        await copy(path.join(this.templateDir, 'createStore.js'), path.join(this.src, 'createStore.js'));
        await copy(path.join(this.templateDir, 'App.js'), path.join(this.components, 'App.js'));
    };

    onNoAnswer = async () => {
        this.stripSection = /\s\/\/ @crs-with-persist-start([\s\S]*?)\/\/ @crs-with-persist-end/gm;
        await this.replaceTemplate();
    };

    replaceTemplate = async () => {
        await replace({
            from: [this.stripSection, /\s*\/\/ @crs-(with|without)-persist-(start|end)/gm],
            to: ['', ''],
            files: path.join(process.cwd(), this.answers.appname, 'src', 'createStore.js'),
        });
    };
}