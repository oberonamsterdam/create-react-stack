import path from 'path';

export default class BaseQuestion {
    constructor (data) {
        this.data = data;
        this.answers = data.answers;
        this.state = data.state;
        this.answer = data.answer;
        this.packages = data.packages;
        this.devPackages = data.devPackages;
        this.dir = path.join(process.cwd(), this.answers.appname);
        this.src = path.join(this.dir, 'src');
        this.components = path.join(this.src, 'components');
        this.commands = data.proxiedCommandsArray;
        this.reactNativeTemplate = path.resolve(path.join(__dirname, '..', 'templates', 'react-native'));
        this.webTemplate = path.resolve(path.join(__dirname, '..', 'templates', 'web'));
    }

    // This function is used to retrieve the packages (that may have been modified) from the current instance and
    // set them as the new current packages.
    get getAllPackages () {
        return {
            packages: this.packages,
            devPackages: this.devPackages,
        };
    }

    get getAllCommands () {
        return this.commands;
    }
}