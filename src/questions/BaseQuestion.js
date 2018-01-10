export default class BaseQuestion {
    constructor (data) {
        this.data = data;
        this.answers = data.answers;
        this.state = data.state;
        this.answer = data.answer;
        this.packages = data.packages;
        this.devPackages = data.devPackages;
    }

    retrievePackages () {
        return {
            packages: this.packages,
            devPackages: this.devPackages,
        };
    }
}

// if you want to call the same method for the same generator.
// do this inside your method.

// make method that both methods will run
// razzle () {
// universalFunction()
// }
// cra () {
//     // universalFunction()
// }
// universalFunction() {
// my shared code
// }