import promisify from 'es6-promisify';
import chalk from 'chalk';
import _package from './package.json';
import questions from './questions';
import { execute } from './questions';
import inquirer from 'inquirer';
import program from 'commander';
import cmd from 'node-cmd';
import log from './services/log';
import { postInstall } from './questions/index';

const get = promisify(cmd.get, {
    thisArg: cmd,
    multiArgs: true
});

(async () => {
    log(chalk`{blue v${_package.version}}`);

    program
        .arguments('<appname>')
        .version(_package.version)
        .parse(process.argv);
    
    try {
        await get('which npx');
    } catch(ex) {
        log(chalk`Unable to locate npx, please update npm to 5.3+ by running {dim npm i npm -g}`, 'error');
        process.exit(1);
    }
    
    const appname = program.args[0];
    let questionsArray = Object.values(questions).map(({ question }) => question);
    
    if(!appname) {
        questionsArray = [
            {
                message: chalk`You didn't provide a directory for the app to be created in.
Remember, you can run COA as follows: {dim create-oberon-app my-awesome-app}
Please specify a name now:`,
                name: 'appname',
                default: 'my-awesome-app'
            },
            ...questionsArray
        ];
    }
    
    const answers = await inquirer.prompt(questionsArray);
    if(!answers.appname) {
        answers.appname = appname;
    }
    
    log(chalk`🍳  Cooking up a fresh new app...`);
    
    for(const key of Object.keys(questions)) {
        const question = questions[key];
        await question.execute(answers[key], answers);
    }
    
    // todo do npm install here
    
    for(const key of Object.keys(questions)) {
        if(key in postInstall) {
            await postInstall[key](answers[key], answers);
        }
    }
})().catch(err => {
    log(err, 'error');
    process.exit(1);
});