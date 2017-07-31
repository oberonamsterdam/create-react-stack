# create-oberon-app

## The problem
React is simplistic by design. It's what makes React great.  
But because it's as simple as it is, you end up with having to add a lot of libraries, which are used that often that you basically need to configure them for every single new project you start on.  
While [`create-react-app`](https://github.com/facebookincubator/create-react-app) and [it's](https://github.com/jaredpalmer/razzle/) [friends](https://github.com/facebook/react-native/tree/master/react-native-cli) save you a lot of configuration time, you still end up spending a lot of time adding and configuring said libraries.  

We've made a collection of what we think are the best and most essential libraries in the react ecosystem out there right at this moment.  
We've bundled them into this simple generator app, which installs and configures the libraries you select.

## opt out
Although this generator is rather opinionated, **every single option is opt out.**  
We never force you to use any of the recommended libraries included in here.

## npx
We are planning on the list of libraries to change often, and we're planning on updating this app as often.  
That's why it's _not_ recommended to globally install `create-oberon-app`, and running it with npx instead (grabbing the latest version every time you execute it):  
```bash
npx create-oberon-app my-awesome-app
```

![](https://jari.lol/aKEpwtrgY5.png)

## Features
create-oberon-app is a opinionated react application generator, for projects that run on **the browser, node, and mobile.**

- 🔀  Server side rendering.  
- 📏  [ESLint](http://eslint.org)  
    - Optionally provide a custom config you wish to use. (falls back to `eslint-config-standard`) **!!TODO!!**
- ⚛  [Redux](http://redux.js.org/)  
    - With SSR enabled, automatically reuse the generated state from the server.  
- 💅  [styled-components](http://styled-components.com)
- 🌊  [flowtype](https://flowtype.org)  
    - Optionally immediately run flow-typed after project setup so you won't forget 😎