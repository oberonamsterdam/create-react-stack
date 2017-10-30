import chalk from 'chalk';
import log from '../services/log';

export default {
    type: 'confirm',
    name: 'eslint',
    message: 'Use ESLint (http://eslint.js.org/)',

    // CRA & razzle already include eslint by default
    when: ({ mobile }) => mobile,
};

export const execute = async ({ answer, devPackages }) => {
    if (answer) {
        devPackages.push('eslint');
    }
};

export const postInstall = ({answer}) => {
    if (answer) {
        log(chalk`ESLint has been installed, but will still need to be configured in your IDE.`, 'warn');
        log(chalk`Configure it or run {dim npx eslint .} manually to get linter output.`, 'warn');
    }
};
