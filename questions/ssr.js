import run from '../services/run';
import promisify from 'es6-promisify';
import fs from 'fs';
import path from 'path';
import replace from 'replace-in-file';
const mv = promisify(fs.rename, { multiArgs: true});
const mkdir = promisify(fs.mkdir, { multiArgs: true});

export default {
    type: 'confirm',
    name: 'ssr',
    message: 'Use SSR? (server side rendering)',
};

export const execute = async (ssr, { appname }) => {
    await run(`npx ${ssr ? 'create-razzle-app' : 'create-react-app'} ${appname}`);

    // move components into separate components dir.
    const src = path.join(process.cwd(), appname, 'src');
    const components = path.join(src, 'components');
    let files = ['App.js', 'App.test.js', 'App.css'];

    if(ssr) {
        files = [...files, 'Home.js', 'Home.css', 'react.svg'];
    } else {
        files = [...files, 'logo.svg'];
    }

    await mkdir(components);

    const promises = [];
    for(const file of files) {
        promises.push(mv(path.join(src, file), path.join(components, file)));
    }
    await Promise.all(promises);

    await replace({
        files: ssr ? [path.join(src, 'client.js'), path.join(src, 'server.js')] : path.join(src, 'index.js'),
        from: /import App from '\.\/App';/g,
        to: 'import App from \'./components/App\''
    });
};