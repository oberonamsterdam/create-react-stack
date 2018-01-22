import path from 'path';
import replace from 'replace-in-file';
import { GENERATOR_TYPES, PROMISIFIED_METHODS } from '../globals/constants';
import { reactNativeSnippets, reduxNoSsr, reduxSsr } from '../globals/snippets';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'redux',
    message: 'Use redux? (http://redux.js.org/)',
};

export class ReduxExecute extends BaseQuestion {

    appname = this.answers.appname;

    webTemplate = path.resolve(path.join(__dirname, '..', 'templates', 'web-with-redux', 'src'));

    constructor (data) {
        super(data);
        this.packages.push('redux', 'react-redux');
    }

    [GENERATOR_TYPES.razzle] = async () => {
        this.packages.push('serialize-javascript');

        await this.replaceRazzleSnippets();

        await PROMISIFIED_METHODS.copy(path.join(this.webTemplate, 'components', `App${this.answers.flow ? '-with-flow' : ''}.js`), path.join(this.src, 'components', 'App.js'));

        await this.copyCreateStoreTemplateFilesToSrc();
    };

    [GENERATOR_TYPES.createReactApp] = async () => {
        await this.replaceCRASnippets();

        await this.copyCreateStoreTemplateFilesToSrc();
    };

    [GENERATOR_TYPES.reactNative] = async () => {
        const { writeFile } = PROMISIFIED_METHODS;
        await writeFile(path.join(this.src, 'createStore.js'), reactNativeSnippets.createStore);
        await writeFile(path.join(this.components, 'App.js'), reactNativeSnippets.appWithRedux);
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