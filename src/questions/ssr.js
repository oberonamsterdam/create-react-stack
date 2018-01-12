import path from 'path';
import replace from 'replace-in-file';
import { GENERATOR_TYPES } from '../globals/constants';
import run from '../services/run';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'reduxSsr',
    message: 'Use SSR? (server side rendering)',
    when: ({ mobile }) => !mobile,
};

export class SsrExecute extends BaseQuestion {
    constructor (data) {
        super(data);
        this.src = path.join(process.cwd(), this.answers.appname, 'src');
        this.files = ['App.js', 'App.test.js', 'App.css'];
        this.components = path.join(this.src, 'components');
    }

    [GENERATOR_TYPES.razzle] = async () => {
        await this.initSsrSetup();
        const files = [path.join(this.src, 'client.js'), path.join(this.src, 'server.js')];
        await this.replaceFiles(files);
    };

    [GENERATOR_TYPES.createReactApp] = async () => {
        await this.initSsrSetup();
        const files = [path.join(this.src, 'index.js')];
        await this.replaceFiles(files);
    };

    replaceFiles = async (files) => {
        await replace({
            files: [files],
            from: /import App from '\.\/App';/g,
            to: 'import App from \'./components/App\'',
        });
    };

    moveFiles = async () => {
        const promises = [];
        for (const file of this.files) {
            promises.push(this.mv(path.join(this.src, file), path.join(this.components, file)));
        }
        await Promise.all(promises);
    };

    initSsrSetup = async () => {
        await run(`npx ${this.generator} ${this.appname}`);

        if (this.generator === GENERATOR_TYPES.razzle) {
            this.files = [...this.files, 'Home.js', 'Home.css', 'react.svg'];
        }
        if (this.generator === GENERATOR_TYPES.createReactApp) {
            this.files = [...this.files, 'logo.svg'];
        }

        // make components dir
        await this.mkdir(this.components);

        // move files into dir
        await this.moveFiles();
    };
}