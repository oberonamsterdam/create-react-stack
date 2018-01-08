/* eslint-disable no-console */

import chalk from 'chalk';
import check from 'check-types';
import program from 'commander';
import promisify from 'es6-promisify';
import inquirer from 'inquirer';
import cmd from 'node-cmd';
import path from 'path';
import Rx from 'rx';
import _package from '../package.json';
import { QUESTION_TYPES } from './constants';
import { store } from './createStore';
import questions from './questions';
import { postInstall } from './questions/index';
import { checkForValidAppname, getQuestion, updateGenerator } from './services/Helpers';
import log from './services/log';
import run from './services/run';

const get = promisify(cmd.get, {
    thisArg: cmd,
    multiArgs: true,
});

export let questionsArray = Object.keys(questions).map((key) => questions[key]);
let questionIndex = 0;

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

    if (!appname) {
        questionsArray = [
            {
                type: QUESTION_TYPES.appname,
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

    const answers = await new Promise((resolve, reject) => {
        let answers = store.getState().answers;
        const onNext = async ({ name, answer }) => {
            answers = store.getState().answers;
            // TODO clean this up, this is for mobile to check if the appname is valid
            // TODO because of react-native-cli's policy on alphanumeric only appnames.
            if (name === QUESTION_TYPES.mobile && answer === true) {
                checkForValidAppname(answers.appname);
            }

            const state = store.getState();
            // means we have an error and should quit process
            if (state.error.length > 0) {
                prompts.onError(state.error);
            }
            store.changeState({
                answers: {
                    ...store.getState().answers,
                    [name]: answer,
                },
            });
            questionIndex++;

            updateGenerator(answers);

            const traverseQuestions = () => {
                const question = questionsArray[questionIndex];
                const currentGenerator = store.getState().generator;
                if (!check.assigned(question)) {
                    return;
                }
                if (!question.generators.includes(currentGenerator)) {
                    questionIndex++;
                    return traverseQuestions();
                } else if (typeof question.question.when === 'function') {
                    const isValid = question.question.when(answers);
                    if (isValid) {
                        return question;
                    } else if (!isValid) {
                        questionIndex++;
                        return traverseQuestions();
                    }
                }
                return question;
            };

            const nextQuestion = traverseQuestions();

            if (!check.assigned(nextQuestion) && !check.assigned(questionsArray[questionIndex + 1])) {
                return prompts.onCompleted();
            } else if (check.assigned(nextQuestion.question)) {
                return prompts.onNext(nextQuestion.question);
            } else {
                return prompts.onError(nextQuestion.question);
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
        prompts.onNext(questionsArray[questionIndex].question);
    });

    if (!answers.appname) {
        answers.appname = appname;
    }

    log(chalk`🍳  Cooking up a fresh new app...`);

    const packages = [];
    const devPackages = [];

    // run exec of questions
    for (const answerKey of Object.keys(answers)) {
        const answer = answers[answerKey];
        if (typeof answer === 'boolean' && answerKey !== QUESTION_TYPES.appname) {
            if (answer === true) {
                await questions[answerKey].execute({ answer: answer, answers, packages, devPackages });
            }
        } else if (answerKey !== QUESTION_TYPES.appname) {
            await questions[answerKey].execute({ answer: answer, answers, packages, devPackages });
        }
    }

    // install packages
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

    // install dev packages
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
