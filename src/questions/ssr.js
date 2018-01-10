import promisify from 'es6-promisify';
import fs from 'fs';
import path from 'path';
import replace from 'replace-in-file';
import { GENERATOR_TYPES, QUESTION_TYPES } from '../constants';
import run from '../services/run';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'reduxSsr',
    message: 'Use SSR? (server side rendering)',
    when: ({ mobile }) => !mobile,
};

export class SsrExecute extends BaseQuestion {
    mv = promisify(fs.rename, { multiArgs: true });
    mkdir = promisify(fs.mkdir, { multiArgs: true });

    [QUESTION_TYPES.razzle] = async () => {
        await this.initSsrSetup();
        const files = [path.join(this.src, 'client.js'), path.join(this.src, 'server.js')];
        await this.replaceFiles(files);
    };

    [QUESTION_TYPES.createReactApp] = async () => {
        await this.initSsrSetup();
        const files = [path.join(this.src, 'index.js');
        await this.replaceFiles(files);
    };

    replaceFiles = async (files) => {
        await replace({
            files: [files],
            from: /import App from '\.\/App';/g,
            to: 'import App from \'./components/App\'',
        });
    };

    initSsrSetup = async () => {
        await run(`npx ${this.generator} ${this.appname}`);

        // move components to seperate components folder
        this.src = path.join(process.cwd(), this.answers.appname, 'src');
        const components = path.join(src, 'components');
        this.files = ['App.js', 'App.test.js', 'App.css'];

        if (this.generator === GENERATOR_TYPES.razzle) {
            this.files = [...this.files, 'Home.js', 'Home.css', 'react.svg'];
        }
        if (this.generator === GENERATOR_TYPES.createReactApp) {
            this.files = [...this.files, 'logo.svg'];
        }

        await this.mkdir(components);

        // rename stuff
        const promises = [];
        for (const file of this.files) {
            promises.push(this.mv(path.join(this.src, file), path.join(components, file)));
        }
        await Promise.all(promises);
    };
};