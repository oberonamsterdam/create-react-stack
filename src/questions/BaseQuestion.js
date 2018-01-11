export default class BaseQuestion {
    constructor (data) {
        this.data = data;
        this.answers = data.answers;
        this.state = data.state;
        this.answer = data.answer;
        this.packages = data.packages;
        this.devPackages = data.devPackages;
    }

    retrievePackages = () => {
        return {
            packages: this.packages,
            devPackages: this.devPackages,
        };
    };
}