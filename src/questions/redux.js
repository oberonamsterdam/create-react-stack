import path from 'path';
import replace from 'replace-in-file';
import { PROMISIFIED_METHODS, QUESTION_TYPES } from '../constants';
import { reduxNoSsr, reduxSsr } from '../snippets';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'redux',
    message: 'Use redux? (http://redux.js.org/)',
};

export class ReduxExecute extends BaseQuestion {
    constructor (data) {
        super(data);
        // bind stuff to this

        this.appname = this.answers.appname;
        this.packages.push('redux', 'react-redux');
        this.template = path.resolve(path.join(__dirname, '..', 'templates', 'web-with-redux', 'src'));
        this.src = path.join(process.cwd(), this.appname, 'src');
    }

    [QUESTION_TYPES.razzle] = async () => {
        this.packages.push('serialize-javascript');

        await this.replaceRazzleSnippets();

        await PROMISIFIED_METHODS.copy(path.join(this.template, 'components', `App${this.answers.flow ? '-with-flow' : ''}.js`), path.join(this.src, 'components', 'App.js'));

        await this.copyCreateStoreTemplateFilesToSrc();
    };

    [QUESTION_TYPES.createReactApp] = async () => {
        await this.replaceCRASnippets();

        await this.copyCreateStoreTemplateFilesToSrc();
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
        await PROMISIFIED_METHODS.copy(path.join(this.template, 'createStore.js'), path.join(this.src, 'createStore.js'));
    };
}