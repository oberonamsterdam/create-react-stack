import promisify from 'es6-promisify';
import fs from 'fs';
import cmd from 'node-cmd';

export const GENERATOR_TYPES = {
    createReactApp: 'create-react-app',
    razzle: 'create-razzle-app',
    reactNative: 'create-react-native-app',
};

export const QUESTION_TYPES = {
    appname: 'appname',
    mobile: 'mobile',
    ssr: 'reduxSsr',
    redux: 'redux',
    flow: 'flow',
    reduxPersist: 'reduxPersist',
    eslint: 'eslint',
    eslintConfig: 'eslintConfig',
    polyfill: 'polyfill',
    styledComponents: 'styledComponents',
};

export const __DEV__ = process.env.DEBUG === '1';

export const PROMISIFIED_METHODS = {
    writeFile: promisify(fs.writeFile),
    readFile: promisify(fs.readFile),
    get: promisify(cmd.get, {
        thisArg: cmd,
        multiArgs: true,
    }),
    rm: promisify(fs.unlink),
    mv: promisify(fs.rename, { multiArgs: true }),
    mkdir: promisify(fs.mkdir, { multiArgs: true }),
    copy: promisify(fs.copyFile, { multiArgs: true }),
};