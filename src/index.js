/* eslint-disable no-console */

import chalk from 'chalk';
import check from 'check-types';
import program from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import Rx from 'rx';
import _package from '../package.json';
import { PROMISIFIED_METHODS, QUESTION_TYPES } from './globals/constants';
import questions from './questions';
import { checkForValidAppname, updateGenerator } from './services/Helpers';
import log from './services/log';
import run from './services/run';
import { store } from './store/createStore';

/*
* Some todos
* */
// TODO implement postInstall as a method on question classes. do this by adding all postInstall methods to an array and calling them afterwards. DONE
// TODO breaks atm. command not found: flow @ flow.js DONE (needs testing)
// TODO expo implementation / check on all questions.
// TODO fix imports at questions/index.js DONE
// TODO Make src/index.js class

export let questionsArray = Object.keys(questions).map((key) => questions[key]);
let questionIndex = 0;

class Main {
    constructor () {
        this.useYarn = false;
        this.questionsArray = Object.keys(questions).map((key) => questions[key]);
        this.questionIndex = 0;
        this.packages = [];
        this.devPackages = [];
        this.postInstallFuncs = [];
    }

    init = async () => {
        log(chalk`{blue v${_package.version}}`);

        this.program = program
            .arguments('<appname>')
            .version(_package.version)
            .parse(process.argv);

        await this.validateEnviroment();
    };

    validateEnviroment = async () => {
        try {
            await PROMISIFIED_METHODS.get('which yarn');
            this.useYarn = true;
            log(chalk`{bold Using yarn!} If you wish to use npm instead, you will have to remove yarn: {dim npm remove yarn -g} (if you installed it with npm)`, 'warn');
            log(chalk`CRA issue: {underline https://github.com/facebookincubator/create-react-app/issues/2809}`, 'warn');
            log(chalk`Razzle issue: {underline https://github.com/jaredpalmer/razzle/issues/365}`, 'warn');
        } catch (ex) {
            // eslint disable-line no-empty
        }

        try {
            await PROMISIFIED_METHODS.get('which npx');
        } catch (ex) {
            log(chalk`Unable to locate npx, please update npm to 5.3+ by running {dim npm i npm -g}`, 'error');
            process.exit(1);
        }

        await this.getAppname();
    };

    getAppname = async () => {
        this.appname = this.program.args[0];

        if (!this.appname) {
            this.questionsArray = [
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
                ...this.questionsArray
            ];
        }

        await this.chooseStack();
    };

    chooseStack = async () => {
        log('📋  Please choose your stack:');

        const prompts = new Rx.Subject();

        this.answers = await new Promise((resolve, reject) => {
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

        // if argument was passed to command, set it as the answers appname
        // because if argument was passed, it wasn't added to the questions, hence its undefined if passed.
        if (!this.answers.appname) {
            this.answers.appname = this.appname;
        }

        await this.cookApp();
    };

    cookApp = async () => {
        console.log();
        log(chalk`🍳  Cooking up a fresh new app...`);
        console.log();

        // run question execs
        await this.runQuestionExecs();
    };

    runQuestionExecs = async () => {
        for (const answerKey of Object.keys(this.answers)) {
            const answer = this.answers[answerKey];
            if (answerKey !== QUESTION_TYPES.appname) {
                const Exec = questions[answerKey].execute;
                const state = store.getState();
                const params = {
                    answers: this.answers,
                    packages: this.packages,
                    devPackages: this.devPackages,
                    answer: answer,
                    state,
                };
                const currentGenerator = state.generator;
                const instance = new Exec(params);

                // onPreInstall, handy if you need to set up things and want to use lifecycle things (you could also just use the constructor, but the option is nice to have.
                if (typeof instance.onPreInstall === 'function') {
                    await instance.onPreInstall();
                }

                // Push onPostInstall if function to functions array to be run, well, post install.
                if (typeof instance.onPostInstall === 'function') {
                    this.postInstallFuncs.push(instance.onPostInstall);
                }

                // If no answer was given or answer was false (this is handy when you want to i.e remove certain template strings.
                if ((typeof answerKey === 'boolean' && answerKey === false) && !!instance.onNoAnswer) {
                    await instance.onNoAnswer();
                    continue;
                }

                // If using default function or something else is wrong
                if (!instance[currentGenerator]) {
                    if (typeof instance.default === 'function') {
                        // Run default method
                        await instance.default();

                        // Retrieve packages that might be modified and set them to vars
                        const { packages: packagesNew, devPackages: devPackagesNew } = instance.retrievePackages();
                        this.packages = packagesNew;
                        this.devPackages = devPackagesNew;

                        // Next question.
                        continue;
                    } else {
                        if (process.env.DEBUG === 1) {
                            log(`No runnable function found at question: ${questions[answerKey]}. This should be a function.`, 'debug');
                        }
                        continue;
                    }
                }

                // If everything is fine
                if (instance[currentGenerator]) {
                    await instance[currentGenerator]();
                }
            }
        }
        // Run npm install / yarn add
        await this.installPackages(this.packages, 'dependencies');
        // Run npm install -D / yarn add --dev
        await this.installPackages(this.devPackages, 'devDependencies');
    };

    installPackages = async (packages, type) => {
        if (packages.length > 0) {
            let message;
            let installCommand;

            // Change message & install command depending on type
            if (type === 'dependencies') {
                message = chalk`Installing {bold.blue dependencies}`;
                if (this.useYarn) {
                    installCommand = 'yarn add';
                } else {
                    installCommand = 'npm i -S';
                }
            } else if (type === 'devDependencies') {
                message = chalk`Installing {bold.blue dev dependencies}`;
                if (this.useYarn) {
                    installCommand = 'yarn add --dev';
                } else {
                    installCommand = 'npm i -D';
                }
            }
            // Log message & which packages are going to be installed
            console.log(message);
            for (const pkg of packages) {
                console.log(chalk`    - {green ${pkg}}`);
            }
            // Install packages
            await run(installCommand + ` ${packages.join(' ')}`, {
                cwd: path.join(process.cwd(), this.answers.appname),
            });
        }
        await this.postInstall();
    };

    postInstall = async () => {
        log('🚚  All packages installed.');

        // run post install
        for (const postInstallFunc of this.postInstallFuncs) {
            await postInstallFunc();
        }

        log('🔥  All done! Your app is ready to use.');
        log(chalk`Feel free to {blue cd ${this.answers.appname}} and {blue npm start}!`);

        process.exit(0);
    };
}

// create instance and run program async.
(async () => {
    const programInstance = new Main();
    await programInstance.init();
})().catch(err => {
    log(err, 'error');
    process.exit(1);
});

// catches unhandled promise rejections. dont remove :).
// shouldnt happen but handy when it does.
process.on('unhandledRejection', (err) => {
    log(err.message, 'error');
    log(err.stack, 'error');
    process.exit(1);
});