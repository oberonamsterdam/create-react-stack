import chalk from 'chalk';
import path from 'path';
import replace from 'replace-in-file';
import { PROMISIFIED_METHODS, QUESTION_TYPES } from '../globals/constants';
import { store } from '../store/createStore';
import log from '../services/log';
import run from '../services/run';
import { errors } from '../globals/snippets';
import BaseQuestion from './BaseQuestion';

export default {
    default: ({ ssr, flow }) => ssr && !flow ? 'standard-react' : 'react-app',
    name: 'eslintConfig',
    message: chalk`{bold What ESLint config should to be used? Enter the eslint-config-{cyan name}}`,
    validate: async (answer) => {
        const packageName = 'eslint-config-' + answer;
        const res = await PROMISIFIED_METHODS.get(`npm s ${packageName} --json`);
        const results = JSON.parse(res[0]).filter(result => result.name === packageName);
        return results.length ? true : `${packageName} was not found on the npm registry.`;
    },
};

export class EslintConfigExecute extends BaseQuestion {
    constructor (data) {
        super(data);
        this.appname = this.answers.appname;
    }

    [QUESTION_TYPES.razzle] = async () => {
        await this.addEslintConfigToDevDeps();
        await this.writeFile(path.join(process.cwd(), this.appname, '.eslintrc'), `
{
    "extends": "${this.answer}"
}
`);
    };

    [QUESTION_TYPES.createReactApp] = async () => {
        await this.addEslintConfigToDevDeps();
        log(errors.ejectCRA, 'warn');

        // update state that we have ejected
        store.changeState({
            createReactAppEjected: true,
        });

        await run('npm run eject', {
            cwd: path.join(process.cwd(), this.appname),
        });

        await replace({
            files: path.join(process.cwd(), this.appname, 'package.json'),
            from: /"extends": "react-app"/g,
            to: `"extends": "${this.answer}"`,
        });
    };

    onPostInstall = async () => {
        // attempt auto fix now that config etc is in place.
        console.log();
        log('Attempting ESLint auto fix..', 'info');
        console.log();
        try {
            await run('npx eslint --fix src', {
                cwd: path.join(process.cwd(), this.appname),
            });
        } catch (ex) {
            log('ESLint auto fix failed! Check log above.', 'warn', ex);
        }
    };

    addEslintConfigToDevDeps = async () => {
        this.devPackages.push(`eslint-config-${this.answer}`);
        const res = await PROMISIFIED_METHODS.get(`npm info "eslint-config-${this.answer}@latest" peerDependencies --json`);
        const peerDeps = JSON.parse(res[0]);
        this.devPackages.push(...Object.keys(peerDeps).map(key => `${key}@${peerDeps[key]}`));
    };
}
