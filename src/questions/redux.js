import fs from 'fs-extra';
import globby from 'globby';
import path from 'path';
import replace from 'replace-in-file';
import { GENERATOR_TYPES } from '../constants';
import { store } from '../createStore';
import log from '../services/log';
import { reduxNoSsr, reduxSsr } from '../snippets';

export default {
    type: 'confirm',
    name: 'redux',
    message: 'Use redux? (http://redux.js.org/)',
};

export const execute = async ({ answer, answers: { appname, ssr, flow, mobile }, packages }) => {
    const { generator } = store.getState();
    const { reactNativeCli, razzle, createReactApp } = GENERATOR_TYPES;
    if (answer) {
        packages.push('redux', 'react-redux');
    }

    if (answer && generator !== reactNativeCli) {
        const template = path.resolve(path.join(__dirname, '..', 'templates', 'web-with-redux', 'src'));
        const src = path.join(process.cwd(), appname, 'src');

        if (generator === razzle) {
            packages.push('serialize-javascript');

            await replace({
                from: reduxSsr.server.from,
                to: reduxSsr.server.to,
                files: path.join(process.cwd(), appname, 'src', 'server.js'),
            });

            await replace({
                from: reduxSsr.client.from,
                to: reduxSsr.client.to,
                files: path.join(process.cwd(), appname, 'src', 'client.js'),
            });

            await fs.copy(path.join(template, 'components', `App${flow ? '-with-flow' : ''}.js`), path.join(src, 'components', 'App.js'));
        } else if (generator === createReactApp) {
            await replace({
                from: reduxNoSsr.index.from,
                to: reduxNoSsr.index.from,
                files: path.join(process.cwd(), appname, 'src', 'index.js'),
            });
        }
        await fs.copy(path.join(template, 'createStore.js'), path.join(src, 'createStore.js'));
    } else if (generator === reactNativeCli) {
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
            files: path.join(process.cwd(), appname, 'index.js'),
        });
    }
};