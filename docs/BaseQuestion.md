## BaseQuestion class
The basequestion class adds certain values to `this`. During runtime certain lifecycle methods are called if they exist in your BaseQuestion subclass. You need to call the super class constructor to access this in your Question subclass.

#### Available methods for question classes:
* `default` -- Called if the current generator isn't implemented
* `[QUESTION_TYPES.razzle]` -- Called if the current generator is razzle on execute.
* `[QUESTION_TYPES.createReactApp]` -- Called if the current generator is CRA on execute.
* `[QUESTION_TYPES.reactNative]` -- Called if the current generator is CRNA on execute.

#### Lifecycle methods for question classes:
* `onNoAnswer` -- Called when answer is false or wasn't given.
* `onPostInstall` -- Called on post install.
* `onPreInstall` -- Called before install.

#### Inherited methods from BaseQuestion:
* `retrievePackages` -- returns an object containing `packages` and `devPackages`

#### Values binded to this from BaseQuestion:
* `this.data` -- object containing `state, answers, answer, packages, devPackages`
* `this.answers` -- All the answers that have been given.
* `this.state` -- The current state.
* `this.answer` -- The answer for this specific question
* `this.packages` -- The packages array filled with which packages to install.
* `this.devPackages` -- Same as packages array but filled with devPackages to install.