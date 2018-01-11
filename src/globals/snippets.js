import chalk from 'chalk';

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
export const flowReactNative = {
    flowConfig: `
[ignore]
.*/node_modules/.*
[include]

[libs]
flow-typed/npm
node_modules/react-native/Libraries/react-native/react-native-interface.js
node_modules/react-native/flow/
node_modules/expo/flow/

[version]
^0.56.0
`,
    flowTyped: `
// @flow

declare module 'react-native' {
    declare module.exports: any
}
`,
};

export const errors = {
    mobileNotAlphanumeric: `Due to how react-native forces alphanumeric appnames, you can't use non-alphanumeric characters in your appname.

wrong: my-awesome-app

good: myAwesomeApp

Please re-run CRS with an alphanumeric-only appname.`,
    ejectCRA: chalk`You indicated that you wanted to use {dim babel-polyfill} instead of the default polyfill. This requires ejecting from {dim create-react-app}, it will prompt you now.`,
};
