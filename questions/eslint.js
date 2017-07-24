import chalk from 'chalk';

export default {
    type: 'confirm',
    name: 'eslint',
    message: chalk`Use {dim eslint} with custom {dim eslint-config-oberon}? (http://eslint.js.org/)`,
};

export const execute = async (answer, { ssr }) => {
    if(ssr) {
        // todo configure webpack loader here
    }
};