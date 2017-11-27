/* eslint-disable no-console */

import chalk from 'chalk';
import program from 'commander';
import promisify from 'es6-promisify';
import inquirer from 'inquirer';
import cmd from 'node-cmd';
import path from 'path';
import Rx from 'rx';
import _package from '../package.json';
import store from './createStore';
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
            // TODO add answers to state
            // TODO check for alphanumeric values in appname, add validate to question
            answers[name] = answer;
            i++;
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
            console.log('onError');
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
