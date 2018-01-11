import path from 'path';
import replace from 'replace-in-file';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'reduxPersist',
    message: 'Use redux-persist? (https://github.com/rt2zz/redux-persist)',
    when: ({ reduxSsr }) => !!reduxSsr,
};

export class ReduxPersistExecute extends BaseQuestion {
    constructor (data) {
        super(data);
    }

    default = async () => {
        this.packages.push('redux-persist');
        this.stripSection = /\s\/\/ @crs-without-persist-start([\s\S]*?)\/\/ @crs-without-persist-end/gm;
        await this.replaceTemplate();
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