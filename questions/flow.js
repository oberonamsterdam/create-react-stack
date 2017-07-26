import promisify from 'es6-promisify';
import cmd from 'node-cmd';
import run from '../services/run';
import path from 'path';

const get = promisify(cmd.get, {
    thisArg: cmd,
    multiArgs: true
});

export default {
    type: 'confirm',
    name: 'flow',
    message: 'Use flow? (http://flow.org)',
};

export const execute = async (answer, { appname }) => {
    if(answer) {
        // we're gonna use flow, so check if flow is actually installed...
        try {
            await get('which flow');
        } catch(ex) {
            // throw an error but with a bit more of an userfriendly message
            throw new Error('Could not find global flow executable (did you run \'npm install -g flow-bin\'?', ex);
        }
        await run('flow init', {
            cwd: path.join(process.cwd(), appname)
        });
    }
};