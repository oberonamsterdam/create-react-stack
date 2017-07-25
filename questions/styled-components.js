import run from '../services/run';
import path from 'path';

export default {
    type: 'confirm',
    name: 'ssr',
    message: 'Use styled-components? (http://styled-components.com)',
};

export const execute = async (answer, { appname }) => {
    if(answer) {
        await run('npm install styled-components', {
            cwd: path.join(process.cwd(), appname)
        });
    }
};