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
// Available methods for question classes:
// onNoAnswer -- called when answer is false
// default -- if you wish to always run the same default function
// TODO onPostInstall -- called on postInstall.
// [QUESTION_TYPES.razzle] -- called if the current generator is razzle on execute
// [QUESTION_TYPES.createReactApp] -- called if the current generator is CRA on execute
// [QUESTION_TYPES.reactNative] -- called if the current generator is CRNA on execute

// Reserved namespaces for methods:
// retrievePackages -- retrieves this.packages if changed from the current instance.

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