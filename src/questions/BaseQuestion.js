import path from 'path';

export default class BaseQuestion {
    constructor (data) {
        this.data = data;
        this.answers = data.answers;
        this.state = data.state;
        this.answer = data.answer;
        this.packages = data.packages;
        this.devPackages = data.devPackages;
        this.src = path.join(process.cwd(), this.answers.appname, 'src');
        this.dir = path.join(process.cwd(), this.answers.appname);
        this.components = path.join(this.src, 'components');
    }

    // This function is used to retrieve the packages (that may have been modified) from the current instance and
    // set them as the new current packages.
    get getAllPackages () {
        return {
            packages: this.packages,
            devPackages: this.devPackages,
        };
    };
}