import path from 'path';
import replace from 'replace-in-file';
import { GENERATOR_TYPES, PROMISIFIED_METHODS } from '../globals/constants';
import { reduxNoSsr, reduxSsr } from '../globals/snippets';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'redux',
    message: 'Use redux? (http://redux.js.org/)',
};

export class ReduxExecute extends BaseQuestion {
    appname = this.answers.appname;
    templateDir = path.join(this.reactNativeTemplate, 'redux');

    constructor (data) {
        super(data);
        this.packages.push('redux', 'react-redux');
    }

    [GENERATOR_TYPES.razzle] = async () => {
        const { copy } = PROMISIFIED_METHODS;
        this.packages.push('serialize-javascript');

        await this.replaceRazzleSnippets();

        await copy(path.join(this.webTemplate, `App${this.answers.flow ? '-with-flow' : ''}.js`), path.join(this.components, 'App.js'));

        await this.copyCreateStoreTemplateFilesToSrc();
    };

    [GENERATOR_TYPES.createReactApp] = async () => {
        await this.replaceCRASnippets();
        await this.copyCreateStoreTemplateFilesToSrc();
    };

    [GENERATOR_TYPES.reactNative] = async () => {
        const { copy } = PROMISIFIED_METHODS;
        await copy(path.join(this.templateDir, 'createStore.js'), path.join(this.src, 'createStore.js'));
        await copy(path.join(this.templateDir, 'App-redux.js'), path.join(this.components, 'App.js'));
    };

    replaceRazzleSnippets = async () => {
        await replace({
            from: [reduxSsr.server.from],
            to: [reduxSsr.server.to],
            files: path.join(process.cwd(), this.appname, 'src', 'server.js'),
        });
        await replace({
            from: [reduxSsr.client.from],
            to: [reduxSsr.client.to],
            files: path.join(process.cwd(), this.appname, 'src', 'client.js'),
        });
    };

    replaceCRASnippets = async () => {
        await replace({
            from: [reduxNoSsr.index.from],
            to: [reduxNoSsr.index.from],
            files: path.join(process.cwd(), this.appname, 'src', 'index.js'),
        });
    };

    copyCreateStoreTemplateFilesToSrc = async () => {
        await PROMISIFIED_METHODS.copy(path.join(this.webTemplate, 'createStore.js'), path.join(this.src, 'createStore.js'));
    };
}