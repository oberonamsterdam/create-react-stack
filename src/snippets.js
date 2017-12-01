export const reduxSsr = {
    server: {
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
    },
    client: {
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
    },
};
export const reduxNoSsr = {
    index: {
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
    },
};
export const errors = {
    mobileNotAlphanumeric: `Due to how react-native forces alphanumeric appnames, you can't use non-alphanumeric characters in your appname.

wrong: my-awesome-app

good: myAwesomeApp

Please re-run CRS with an alphanumeric-only appname.`,
};