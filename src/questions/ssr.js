import promisify from 'es6-promisify';
import fs from 'fs';
import path from 'path';
import replace from 'replace-in-file';
import { GENERATOR_TYPES } from '../constants';
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
    const { createReactApp, razzle } = GENERATOR_TYPES;
    const generator = answer ? razzle : createReactApp;

    await run(`npx ${generator} ${appname}`);

    // move components into separate components dir.
    const src = path.join(process.cwd(), appname, 'src');
    const components = path.join(src, 'components');
    let files = ['App.js', 'App.test.js', 'App.css'];

    if (answer) {
        files = [...files, 'Home.js', 'Home.css', 'react.svg'];
    } else {
        files = [...files, 'logo.svg'];
    }

    await mkdir(components);

    const promises = [];
    for (const file of files) {
        promises.push(mv(path.join(src, file), path.join(components, file)));
    }
    await Promise.all(promises);

    await replace({
        files: answer ? [path.join(src, 'client.js'), path.join(src, 'server.js')] : path.join(src, 'index.js'),
        from: /import App from '\.\/App';/g,
        to: 'import App from \'./components/App\'',
    });
};