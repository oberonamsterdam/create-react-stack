import promisify from 'es6-promisify';
import fs from 'fs';
import path from 'path';
import replace from 'replace-in-file';
import { GENERATOR_TYPES } from '../constants';
import { store } from '../createStore';
import run from '../services/run';

const mv = promisify(fs.rename, { multiArgs: true });
const mkdir = promisify(fs.mkdir, { multiArgs: true });

export default {
    type: 'confirm',
    name: 'reduxSsr',
    message: 'Use SSR? (server side rendering)',
    when: ({ mobile }) => !mobile,
};

export const execute = async ({ answer, answers: { appname } }) => {
    const currentGenerator = store.getState().generator;
    const { createReactApp, razzle } = GENERATOR_TYPES;
    if (currentGenerator !== createReactApp && currentGenerator !== razzle) {
        throw new Error('Invalid generator in state for question SSR.');
    }

    await run(`npx ${currentGenerator} ${appname}`);

    // move components into separate components dir.
    const src = path.join(process.cwd(), appname, 'src');
    const components = path.join(src, 'components');
    let files = ['App.js', 'App.test.js', 'App.css'];

    if (currentGenerator === razzle) {
        files = [...files, 'Home.js', 'Home.css', 'react.svg'];
    }
    if (currentGenerator === createReactApp) {
        files = [...files, 'logo.svg'];
    }

    await mkdir(components);

    const promises = [];
    for (const file of files) {
        promises.push(mv(path.join(src, file), path.join(components, file)));
    }
    await Promise.all(promises);

    let replaceFiles = [];
    if (currentGenerator === razzle) {
        replaceFiles = [path.join(src, 'client.js'), path.join(src, 'server.js')];
    }
    if (currentGenerator === createReactApp) {
        replaceFiles = path.join(src, 'index.js');
    }

    await replace({
        files: replaceFiles,
        from: /import App from '\.\/App';/g,
        to: 'import App from \'./components/App\'',
    });
};