import chalk from 'chalk';
import path from 'path';
import run from '../services/run';
import replace from 'replace-in-file';
import fs from 'fs';
import log from '../services/log';
import promisify from 'es6-promisify';
import cmd from 'node-cmd';

const writeFile = promisify(fs.writeFile);
const get = promisify(cmd.get, {
    thisArg: cmd,
    multiArgs: true,
});

export default {
    // standard does not support flow, so react-app is probably a more suitable choice
    default: ({ ssr, flow }) => ssr && !flow ? 'standard-react' : 'react-app',
    name: 'eslintConfig',
    message: chalk`{bold What ESLint config should to be used? Enter the eslint-config-{cyan name}}`,
    when: ({ ssr, eslint, mobile }) => (ssr && eslint) || (mobile && eslint) || !ssr,
    validate: async (answer) => {
        const packageName = 'eslint-config-' + answer;
        const res = await get(`npm s ${packageName} --json`);
        const results = JSON.parse(res[0]).filter(result => result.name === packageName);
        return results.length ? true : `${packageName} was not found on the npm registry.`;
    },
};

export const execute = async ({ answer, answers: { ssr, appname, mobile, eslint }, devPackages }) => {
    if (!eslint || (ssr && mobile)) {
        return;
    }

    if (answer !== 'react-app' && (!ssr || ssr || mobile)) {
        devPackages.push(`eslint-config-${answer}`);
        const res = await get(`npm info "eslint-config-${answer}@latest" peerDependencies --json`);
        const peerDeps = JSON.parse(res[0]);
        devPackages.push(...Object.keys(peerDeps).map(key => `${key}@${peerDeps[key]}`));
    }

    if (answer !== 'react-app' && !ssr) {
        // eject if we're on create-react-app.
        log(chalk`You indicated a different config than {dim react-app}. This requires ejecting from {dim create-react-app}, it will prompt you now.`, 'warn');
        await run('npm run eject', {
            cwd: path.join(process.cwd(), appname),
        });
        await replace({
            files: path.join(process.cwd(), appname, 'package.json'),
            from: /"extends": "react-app"/g,
            to: `"extends": "${answer}"`,
        });
    }

    await writeFile(path.join(process.cwd(), appname, '.eslintrc'), `
{
    "extends": "${answer}"
}
`);
};

export const postInstall = async ({ answers: { appname, ssr, eslint, mobile } }) => {
    if (ssr && (!eslint || mobile) && !eslint) {
        return;
    }

    // attempt auto fix now that config etc is in place.
    try {
        await run('npx eslint --fix src', {
            cwd: path.join(process.cwd(), appname),
        });
    } catch (ex) {
        log('ESLint auto fix failed! Check log above.', 'warn', ex);
    }
};