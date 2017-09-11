import path from 'path';
import replace from 'replace-in-file';
import fs from 'fs-extra';
import globby from 'globby';
import log from '../services/log';

export default {
    type: 'confirm',
    name: 'redux',
    message: 'Use redux? (http://redux.js.org/)',
};

export const execute = async (answer, { appname, ssr, flow, mobile }, packages) => {
    if (answer) {
        packages.push('redux', 'react-redux');
    }

    if (answer && !mobile) {
        const template = path.resolve(path.join(__dirname, '..', 'templates', 'web-with-redux', 'src'));
        const src = path.join(process.cwd(), appname, 'src');

        if (ssr) {
            packages.push('serialize-javascript');

            await replace({
                from: [
                    /const context = {};/gm,
                    /<script src="\${assets\.client\.js}" defer><\/script>/gm,
                    /import React from 'react';/gm,
                    /<App \/>/gm,
                    /\.get\('\/\*', \(/g,
                ],
                to: [
                    `const context = {};
        const store = await createStore();`,
                    `<script>window.__initialState = \${serialize(store.getState())};</script>
<script src="\${assets.client.js}" defer></script>`,
                    `import React from 'react';
import createStore from './createStore';
import serialize from 'serialize-javascript';`,
                    '<App store={store} />',
                    '.get(\'/*\', async (',
                ],
                files: path.join(process.cwd(), appname, 'src', 'server.js'),
            });

            await replace({
                from: [
                    /\nrender/g,
                    /<App \/>/g,
                    /\s$/g,
                ],
                to: [
                    'import createStore from \'./createStore\';\n\ncreateStore(window.__initialState).then(store => {\nrender',
                    '<App store={store} />',
                    '\n});',
                ],
                files: path.join(process.cwd(), appname, 'src', 'client.js'),
            });

            await fs.copy(path.join(template, 'components', `App${flow ? '-with-flow' : ''}.js`), path.join(src, 'components', 'App.js'));
        } else {
            await replace({
                from: [
                    /<App \/>/g,
                    /\nReactDOM/g,
                    /registerServiceWorker\(\)/g,
                ],
                to: [
                    '<Provider store={store}><App /></Provider>',
                    'import createStore from \'./createStore\';\nimport { Provider } from \'react-redux\';\n\ncreateStore(window.__initialState).then(store => {\nReactDOM',
                    '});\nregisterServiceWorker()',
                ],
                files: path.join(process.cwd(), appname, 'src', 'index.js'),
            });
        }

        await fs.copy(path.join(template, 'createStore.js'), path.join(src, 'createStore.js'));
    } else if (mobile) {
        const template = path.join(__dirname, '..', 'templates', 'react-native', answer ? 'with-redux' : 'without-redux');
        const appDir = path.join(process.cwd(), appname);
        const files = await globby(path.join(template, '**/*.js'));
        const promises = [];
        for (const from of files) {
            const to = path.join(appDir, path.relative(template, from));
            log('Copying', 'debug', from, 'to', to);
            promises.push(fs.copy(from, to));
        }
        await Promise.all(promises);
        await replace({
            from: /%appname%/g,
            to: appname,
            files: path.join(process.cwd(), appname, 'index.*.js'),
        });
    }
};