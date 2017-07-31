// executes a process and returns a promise while redirecting its stdout + stdin to our own

import cp from 'child_process';
import log from './log';

export default (command, options = {}) => {
    // probably don't pass too advanced commands into this function, because this 'argument parser' is kinda dumb
    const args = command.split(' ');
    const cmd = args.splice(0, 1)[0];
    
    log('services/run', 'debug', command, options);
    return new Promise((resolve, reject) => {
        const child = cp.spawn(cmd, args, {
            stdio: 'inherit',
            shell: true,
            ...options
        });

        child.on('close', (code) => {
            if(code !== 0) {
                reject(new Error(`Process ${cmd} exited with code ${code}`));
            } else {
                resolve();
            }
        });
    });
};