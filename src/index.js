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

        this.prompts = new Rx.Subject();

        this.answers = await new Promise((resolve, reject) => {
            const onNext = async ({ name, answer }) => {
                let answers = store.getState().answers;
                if (name === QUESTION_TYPES.mobile && answer === true) {
                    checkForValidAppname(answers.appname);
                }

                const state = store.getState();
                // means we have an error and should quit process
                if (state.error.length > 0) {
                    this.prompts.onError(state.error);
                }
                store.changeState({
                    answers: {
                        ...store.getState().answers,
                        [name]: answer,
                    },
                });
                answers = store.getState().answers;

                this.questionIndex++;
                updateGenerator(answers);

                const traverseQuestions = () => {
                    const question = this.questionsArray[this.questionIndex];
                    const currentGenerator = store.getState().generator;
                    if (!check.assigned(question)) {
                        return;
                    }
                    if (!question.generators.includes(currentGenerator)) {
                        this.questionIndex++;
                        return traverseQuestions();
                    } else if (typeof question.question.when === 'function') {
                        const isValid = question.question.when(answers);
                        if (isValid) {
                            return question;
                        } else if (!isValid) {
                            this.questionIndex++;
                            return traverseQuestions();
                        }
                    }
                    return question;
                };

                const nextQuestion = traverseQuestions();

                if (!check.assigned(nextQuestion) && !check.assigned(this.questionsArray[this.questionIndex + 1])) {
                    return this.prompts.onCompleted();
                } else if (check.assigned(nextQuestion.question)) {
                    return this.prompts.onNext(nextQuestion.question);
                } else {
                    return this.prompts.onError(nextQuestion.question);
                }
            };
            const onError = (err) => {
                reject(err);
            };
            const onExit = () => {
                resolve(store.getState().answers);
            };

            inquirer.prompt(this.prompts).ui.process.subscribe(
                onNext,
                onError,
                onExit,
            );
            // kick start question inquiring
            this.prompts.onNext(this.questionsArray[this.questionIndex].question);
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
        console.log(this.answers);
        for (const answerKey of Object.keys(this.answers)) {
            const answer = this.answers[answerKey];
            if (answerKey !== QUESTION_TYPES.appname) {
                const Exec = questions[answerKey].execute;
                const state = store.getState();
                // intercept push to commands array and run command
                const proxiedCommandsArray = [];
                proxiedCommandsArray.push = async function () {
                    const command = arguments[0];
                    if (command) {
                        // add arguments via array order i.e ['npm run myScript', {cwd: process.cwd()}]
                        await run.apply(this, command);
                    }
                    return Array.prototype.push.apply(this, arguments);
                };
                const params = {
                    answers: this.answers,
                    packages: this.packages,
                    devPackages: this.devPackages,
                    answer: answer,
                    state,
                    proxiedCommandsArray,
                };
                const instance = new Exec(params);

                if ((typeof answer === 'boolean' && answer === true) || (answerKey === QUESTION_TYPES.ssr)) {
                    // onPreInstall, handy if you need to set up things and want to use lifecycle things (you could also just use the constructor, but the option is nice to have.
                    if (typeof instance.onPreInstall === 'function') {
                        await instance.onPreInstall();
                    }

                    // Push onPostInstall if function to functions array to be run, well, post install.
                    if (typeof instance.onPostInstall === 'function') {
                        this.postInstallFuncs.push(instance.onPostInstall);
                    }
                }
                // If no answer was given or answer was false (this is handy when you want to i.e remove certain webTemplate strings.
                if ((typeof answer === 'boolean' && answer === false) && (answerKey !== QUESTION_TYPES.ssr)) {
                    if (typeof instance.onNoAnswer === 'function') {
                        await instance.onNoAnswer();
                    }
                    continue;
                }

                const { generator: currentGenerator } = store.getState();

                if ((typeof answer === 'boolean' && answer === true) || (answerKey === QUESTION_TYPES.ssr)) {
                    // If using default function or something else is wrong
                    console.log('executing..:', answerKey);

                    if (!instance[currentGenerator]) {
                        if (typeof instance.default === 'function') {
                            // Run default method
                            await instance.default();

                            // Retrieve packages that might be modified and set them to vars
                            const { packages: packagesNew, devPackages: devPackagesNew } = instance.getAllPackages;
                            this.packages = packagesNew;
                            this.devPackages = devPackagesNew;

                            // Next question.
                            continue;
                        } else {
                            log(`No runnable function found at question: ${questions[answerKey]}. This should be a function.`, 'debug');
                            continue;
                        }
                    }

                    // If everything is fine
                    if (instance[currentGenerator]) {
                        await instance[currentGenerator]();

                        // Retrieve packages that might be modified and set them to vars
                        const { packages: packagesNew, devPackages: devPackagesNew } = instance.getAllPackages;
                        this.packages = packagesNew;
                        this.devPackages = devPackagesNew;
                    }
                }
            }
        }
        // Run npm install / yarn add
        await this.installPackages(this.packages, 'dependencies');
        // Run npm install -D / yarn add --dev
        await this.installPackages(this.devPackages, 'devDependencies');

        // Run post install funcs & log nice messages
        await this.postInstall();
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
    };

    postInstall = async () => {
        log('🚚  All packages installed.');

        // run post install
        for (const postInstallFunc of this.postInstallFuncs) {
            await postInstallFunc();
        }

        log('🔥  All done! Your app is ready to use.');
        log(chalk`Feel free to {blue cd ${this.answers.appname}} and {blue npm start}!`);
    };
}

// create instance and run program async.
(async () => {
    const programInstance = new Main();
    await programInstance.init();
    // Process doesn't exit because it's a child process of backpack (but does exit if directly run)
    process.exit(0);
})().catch(err => {
    log(err, 'error');
    process.exit(1);
});

// catches unhandled promise rejections. just in case.
// shouldnt happen but handy when it does.
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});