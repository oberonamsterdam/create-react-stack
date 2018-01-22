import path from 'path';
import replace from 'replace-in-file';
import { GENERATOR_TYPES, PROMISIFIED_METHODS } from '../globals/constants';
import { reactNativeSnippets } from '../globals/snippets';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'reduxPersist',
    message: 'Use redux-persist? (https://github.com/rt2zz/redux-persist)',
    // If ssr or expo & redux
    // TODO implement CRA for this!
    when: ({ reduxSsr, mobile, redux } ) => (!!reduxSsr || (!!mobile && redux)),
};

export class ReduxPersistExecute extends BaseQuestion {
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
        const { writeFile } = PROMISIFIED_METHODS;
        await writeFile(path.join(this.src, 'createStore.js'), reactNativeSnippets.createStoreWithPersist);
        await writeFile(path.join(this.components, 'App.js'), reactNativeSnippets.appWithReduxPersist);
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