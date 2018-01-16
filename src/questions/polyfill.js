import path from 'path';
import replace from 'replace-in-file';
import { GENERATOR_TYPES, PROMISIFIED_METHODS } from '../globals/constants';
import { errors } from '../globals/snippets';
import addRazzleMod from '../services/addRazzleMod';
import log from '../services/log';
import run from '../services/run';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'polyfill',
    message: 'Use babel-polyfill? (adds IE support) (https://babeljs.io/docs/usage/polyfill/)',
    when: ({ mobile }) => !mobile,
};

export class PolyFillExecute extends BaseQuestion {
    constructor (data) {
        super(data);
        this.appname = this.answers.appname;
        this.packages.push('babel-polyfill');
    }

    [GENERATOR_TYPES.razzle] = async () => {
        this.packages.push('oberon-razzle-modifications');
        await addRazzleMod(this.appname);
        await replace({
            from: /const usePolyfill = false;/,
            to: 'const usePolyfill = true;',
            files: path.join(process.cwd(), this.appname, 'razzle.config.js'),
        });
    };

    [GENERATOR_TYPES.createReactApp] = async () => {
        log(errors.ejectCRA, 'warn');
        await run('npm run eject', {
            cwd: path.join(process.cwd(), this.appname),
        });
        await this.editWebpackConfigAndRemovePolyfillFile();
    };

    editWebpackConfigAndRemovePolyfillFile = async () => {
        await replace({
            from: /require\.resolve\('.\/polyfills'\)/g,
            to: 'require.resolve(\'babel-polyfill\')',
            files: ['webpack.config.dev.js', 'webpack.config.prod.js'].map(config => path.join(process.cwd(), this.appname, 'config', config)),
        });
        await PROMISIFIED_METHODS.rm(path.join(process.cwd(), this.appname, 'config', 'polyfills.js'));
    };
}