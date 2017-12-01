/* eslint-disable no-console */

import chalk from 'chalk';
import program from 'commander';
import promisify from 'es6-promisify';
import inquirer from 'inquirer';
import cmd from 'node-cmd';
import path from 'path';
import Rx from 'rx';
import _package from '../package.json';
import { store } from './createStore';
import questions from './questions';
import { postInstall } from './questions/index';
import log from './services/log';
import run from './services/run';

const get = promisify(cmd.get, {
    thisArg: cmd,
    multiArgs: true,
});

(async () => {
    log(chalk`{blue v${_package.version}}`);

    program
        .arguments('<appname>')
        .version(_package.version)
        .parse(process.argv);

    let useYarn = false;
    try {
        await get('which yarn');
        useYarn = true;
        log(chalk`{bold Using yarn!} If you wish to use npm instead, you will have to remove yarn: {dim npm remove yarn -g} (if you installed it with npm)`, 'warn');
        log(chalk`CRA issue: {underline https://github.com/facebookincubator/create-react-app/issues/2809}`, 'warn');
        log(chalk`Razzle issue: {underline https://github.com/jaredpalmer/razzle/issues/365}`, 'warn');
    } catch (ex) {
        // eslint disable-line no-empty
    }

    try {
        await get('which npx');
    } catch (ex) {
        log(chalk`Unable to locate npx, please update npm to 5.3+ by running {dim npm i npm -g}`, 'error');
        process.exit(1);
    }

    const appname = program.args[0];
    let questionsArray = Object.keys(questions).map((key) => questions[key]);

    if (!appname) {
        questionsArray = [
            {
                question: {
                    message: chalk`You didn't provide a directory for the app to be created in.
Remember, you can run CRS as follows: {dim create-react-stack my-awesome-app}
Please specify a name now:`,
                    name: 'appname',
                    default: 'my-awesome-app',
                },
            },
            ...questionsArray
        ];
    }

    log('📋  Please choose your stack:');

    const prompts = new Rx.Subject();
    let i = 0;

    const answers = await new Promise((resolve, reject) => {
        const answers = {};
        const onNext = ({ name, answer }) => {
            const state = store.getState();
            // means we have an error and should quit process
            if (state.error.length > 0) {
                prompts.onError(state.error);
            }
            answers[name] = answer;
            i++;

            /*
            * question conditions / assumptions:
            *
            * eslint.js:
            * - // CRA & razzle already include eslint by default
            * - when: ({ mobile }) => mobile,
            * - shows on mobile
            * - checks if has answer
            *
            * eslint-config.js
            * - doesn't check if theres no eslint that it should return null anyway
            * - assumes default answer from reduxSsr && !flow, see default in default export
            * - assumes we're on create-react-app
            * - assumes we're on razzle later on
            * - doesn't check for answer (BAD!)
            * - runs eslint fix on postInstall, otherwise spams out auto fix (is this really necessary?)
            *
            * flow.js
            * - checks if has answer
            * - runs flowTyped on postInstall if user says yes
            *
            * mobile.js
            * - checks if has answer
            * - TODO react native hates hyphens i.e my-app. fix for this?
            * - TODO currently the setup fails if appname is not alphanumeric (i.e camelCased)
            *
            * polyfill.js
            * - doesn't show if on mobile
            * - checks if has answer
            * - assumes we're on razzle if reduxSsr, pushes oberon-razzle-modifications (why?)
            * - else assumes we're on create react app
            *
            * redux.js
            * - checks if has answer
            * - assumes that if not mobile we're on web
            *   - assumes that we're using razzle if reduxSsr
            *   - assumes we're using create react app otherwise
            * - does some dangerous injecting of code
            * - does some regex to replace template name with appname
            *
            * redux-persist.js
            * - doesn't show if redux is not chosen
            * - checks if not has answer, then removes the section with crs-with-persist-start, since the user
            *   didn't want redux-persist
            * - else if has answer removes the section with crs-without-persist-start and pushes redux-persist to packages
            *
            * reduxSsr.js
            * - shows if !mobile
            * - for some reason checks inside question if mobile aswell
            * - assumes that if not answer we're using create-react-app (I think?)
            *
            * styled-components.js
            * - checks if has answer
            * */

            if (questionsArray[i]) {
                const arr = store.getState().answers;
                arr.push({ [name]: answer });
                store.changeState({
                    answers: arr,
                });
                const fun = questionsArray[i].question.when;
                if (typeof fun === 'function') {
                    const willNotSkip = questionsArray[i].question.when(answers);
                    if (!willNotSkip) {
                        i++;
                    }
                    prompts.onNext(questionsArray[i].question);
                } else {
                    prompts.onNext(questionsArray[i].question);
                }
            } else {
                prompts.onCompleted();
            }
        };
        const onError = (err) => {
            reject(err);
        };
        const onExit = () => {
            resolve(answers);
        };

        inquirer.prompt(prompts).ui.process.subscribe(
            onNext,
            onError,
            onExit,
        );
        prompts.onNext(questionsArray[0].question);
    });

    if (!answers.appname) {
        answers.appname = appname;
    }

    log(chalk`🍳  Cooking up a fresh new app...`);

    const packages = [];
    const devPackages = [];
    for (const key of Object.keys(questions)) {
        const question = questions[key];
        let validExecute;
        if (question.requirements.length > 0) {
            validExecute = question.requirements.filter(requirement => {
                if (typeof requirement.condition === 'function') {
                    return requirement.condition({ answers: answers, answer: answers[key] });
                } else {
                    return requirement.condition;
                }
            });
            if (validExecute.length > 0) {
                continue;
            }
        }
        await question.execute({ answer: answers[key], answers, packages, devPackages });
    }

    if (packages.length) {
        console.log();
        console.log(chalk`Installing {bold.blue packages}:`);
        for (const pkg of packages) {
            console.log(chalk`    - {blue ${pkg}}`);
        }
        console.log();

        await run(`${useYarn ? 'yarn add' : 'npm install'} ${packages.join(' ')}`, {
            cwd: path.join(process.cwd(), answers.appname),
        });
    }
    if (devPackages.length) {
        console.log();
        console.log(chalk`Installing {bold.green dev packages}:`);
        for (const pkg of devPackages) {
            console.log(chalk`    - {green ${pkg}}`);
        }
        console.log();

        await run(`${useYarn ? 'yarn add' : 'npm install'} ${devPackages.join(' ')} --${useYarn ? 'dev' : 'save-dev'}`, {
            cwd: path.join(process.cwd(), answers.appname),
        });
    }

    log('🚚  All packages installed.');

    for (const key of Object.keys(questions)) {
        if (key in postInstall) {
            await postInstall[key]({ answer: answers[key], answers });
        }
    }

    log('🔥  All done! Your app is ready to use.');
    log(chalk`Feel free to {blue cd ${answers.appname}} and {blue npm start}!`);
})().catch(err => {
    log(err, 'error');
    process.exit(1);
});
