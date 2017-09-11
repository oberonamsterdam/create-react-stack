/* eslint-disable no-console */
import chalk from 'chalk';

export default (message, type = 'log', ...misc) => {
    if (type === 'debug' && !process.env.DEBUG) {
        return;
    }
    let content = [chalk`{bold.green create-react-stack}`];
    switch (type) {
        case 'log':
            content = [...content, chalk`{bold.cyan INFO}`];
            break;
        case 'error':
            content = [...content, chalk`{bold.red ERR!}`];
            break;
        case 'warn':
            content = [...content, chalk`{bold.yellow WARN}`];
            break;
        case 'debug':
            content = [...content, chalk`{bold.magenta VERB}`];
            break;
    }

    content = [...content, message, ...misc];

    console[type === 'debug' ? 'log' : type](...content);
};