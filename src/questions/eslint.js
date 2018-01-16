/* eslint-disable no-useless-constructor */
import chalk from 'chalk';
import log from '../services/log';
import BaseQuestion from './BaseQuestion';

export default {
    type: 'confirm',
    name: 'eslint',
    message: 'Use ESLint (http://eslint.js.org/)',

    // CRA & razzle already include eslint by default
    when: ({ mobile }) => mobile,
};

export class EslintExecute extends BaseQuestion {
    constructor (data) {
        super(data);
    }

    default = async () => {
        this.devPackages.push('eslint');
        this.devPackages.push('babel-eslint');
    };

    onPostInstall () {
        log(chalk`ESLint has been installed, but will still need to be configured in your IDE.`, 'warn');
        log(chalk`Configure it or run {dim npx eslint .} manually to get linter output.`, 'warn');
    }
}

export const postInstall = ({ answer }) => {
    if (answer) {
        log(chalk`ESLint has been installed, but will still need to be configured in your IDE.`, 'warn');
        log(chalk`Configure it or run {dim npx eslint .} manually to get linter output.`, 'warn');
    }
};
