import { log } from '../cli';
import run from '../services/run';
import chalk from 'chalk';

export default {
    type: 'confirm',
    name: 'ssr',
    message: 'Use SSR? (server side rendering)',
};

export const execute = async (answer, { appname, eslint }) => {
    await run(`npx ${answer ? 'create-razzle-app' : 'create-react-app'} ${appname}`);
    if(!answer && eslint) {
        // eject if we're on create-react-app.
        log(chalk`You indicated that you wanted to use the custom {dim eslint-config-oberon}. This requires ejecting, {dim create-react-app} will prompt you now.`, 'warn');
        await run('npm run eject');
    }
};