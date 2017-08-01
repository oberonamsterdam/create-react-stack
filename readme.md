# create-react-stack
create-react-stack is a opinionated react application generator, for projects that run on **the browser, node, and mobile.**

![](https://jari.lol/aKEpwtrgY5.png)

## the problem
React is simplistic by design. It's what makes React great.  
But because it's as simple as it is, you end up with having to add a lot of libraries, which are used that often that you basically need to configure them for every single new project you start on.  
While [`create-react-app`](https://github.com/facebookincubator/create-react-app) and [it's](https://github.com/jaredpalmer/razzle/) [friends](https://github.com/facebook/react-native/tree/master/react-native-cli) save you a lot of configuration time, you still end up spending a lot of time adding and configuring said libraries.  

This is a collection of the best and most essential libraries in the react ecosystem out there right at this moment.  
They're bundled into this simple generator app, which installs and configures the libraries you select; but only the ones you explicitly select.  
Although this generator is rather opinionated, **every single option is opt out.**  
It never forces you to use any of the recommended libraries included in here.

## 'installing'
This list of libraries will likely change often, and we're planning on updating this app as often.  
That's why it's _not_ recommended to globally install `create-react-stack`, and running it with [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) instead (grabbing the latest version every time you execute it):  
```bash
npx create-react-stack my-awesome-app
```

Optionally when using yarn, you can run:
```bash
yarn create oberon-app my-awesome-app
```


## features
- 📱  React Native
- 🔀  Server side rendering.  
- 📏  [ESLint](http://eslint.org)  
    - Optionally provide a custom config you wish to use.     
- ⚛  [Redux](http://redux.js.org/)  
    - With SSR enabled, automatically reuse the generated state by the server from the client side.  
    - Optionally [persist and rehydrate store](https://github.com/rt2zz/redux-persist) on client side.  
    - Automatically hooks in [the redux extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) if available.
- 💅  [styled-components](http://styled-components.com)
- 🌊  [flowtype](https://flowtype.org)  
    - Will ask you to run flow-typed after project setup so you won't forget 😎