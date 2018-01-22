import path from 'path';
import replace from 'replace-in-file';
import { GENERATOR_TYPES, PROMISIFIED_METHODS } from '../globals/constants';
import { store } from '../store/createStore';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'reduxSsr',
    message: 'Use SSR? (server side rendering)',
    when: ({ mobile }) => !mobile,
};

export class SsrExecute extends BaseQuestion {
    files = ['App.js', 'App.test.js', 'App.css'];
    appname = this.answers.appname;

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
        try {
            await replace({
                files: files,
                from: /import App from '\.\/App';/g,
                to: 'import App from \'./components/App\'',
            });
        } catch (Err) {
            console.log(Err);
        }
    };

    moveFiles = async () => {
        const { mv } = PROMISIFIED_METHODS;
        for (const file of this.files) {
            await mv(path.join(this.src, file), path.join(this.components, file));
        }
    };

    initSsrSetup = async () => {
        const { generator } = store.getState();
        const { mkdir } = PROMISIFIED_METHODS;
        await this.commands.push([`npx ${generator} ${this.appname}`]);


        if (generator === GENERATOR_TYPES.razzle) {
            this.files = [...this.files, 'Home.js', 'Home.css', 'react.svg'];
        }
        if (generator === GENERATOR_TYPES.createReactApp) {
            this.files = [...this.files, 'logo.svg'];
        }


        // make components dir
        await mkdir(this.components);

        // move files into dir
        await this.moveFiles();
    };
}