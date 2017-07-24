import promisify from 'es6-promisify';
import cmd from 'node-cmd';
import run from '../services/run';
import path from 'path';

const get = promisify(cmd.get, {
    thisArg: cmd,
    multiArgs: true
});

export default {
    type: 'input',
    name: 'flow',
    message: 'Use flow? (http://flow.org)',
    default: 'Yes',
    validate: async answer => {
        if(answer) {
            // we're gonna use flow, so check if flow is actually installed...
            try {
                await get('which flow');
            } catch(ex) {
                return 'Could not find flow executable (did you run \'npm install -g flow-bin\'?)';
            }
        }
        return true;
    },
    filter: answer => {
        // can't use type: confirm because inquirer won't call validate in that case :(
        switch(answer.toLowerCase()) {
            case 'y':
            case 'yes':
                return true;
            case 'no':
            case 'n':
                return false;
            default:
                throw new Error("Invalid input");
        }
    }
};

export const execute = async (answer, { appname }) => {
    await run('flow init', {
        cwd: path.join(process.cwd() + '/' + appname)
    })
};