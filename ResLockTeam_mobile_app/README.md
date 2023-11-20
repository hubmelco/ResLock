# Introduction

This is the front end of ResLock. It describes and does all things related to the user interface of our app.

# Getting Started

When react-native initialized the project, it used yarn so we will be using yarn. This means you may have to install yarn: `npm install yarn`.
You may also have to change your Execution Policy if using windows. Open the terminal as administrator and run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine`
Everything should be set up. You can now run `yarn` and it should install the dependencies needed from yarn.lock and package.json. You can run `yarn test` or `yarn start` to confirm.

The dependencies we use are Expo, React-Native, React-Navigation, Typescript, React-Redux, EsLint, Prettier, and Jest. Expo works with React Native to build the UI of our application and makes the applicaiton compatible with both Android and iOS. React-Redux controls the state of our application for easier testing. EsLint and Prettier helps with stylistic consistency and error reduction. Jest is our testing framework.

### It is highly recommended to read the documentation of our dependencies to learn how to use them.

Expo: https://docs.expo.dev
Testing expo apps with Jest: https://docs.expo.dev/guides/testing-with-jest/ or https://jestjs.io/docs/getting-started
Typescript: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
React Navigation is used to move between screens of our application: https://reactnavigation.org/docs/getting-started/
React Redux information can be found at: https://react-redux.js.org/tutorials/quick-start

Release 0.0.0

# Build and Test

run `yarn` to build and `yarn test` to test after following the init steps in Getting Started

If you ever need to install other dependencies, use `yarn add [dependency]`. Additionally, `--dev` is the yarn equivalent of `--save-dev` in npm and `global` is the yarn equivalent of `-g` in npm.
Using npm may break the app as we shouldn't have both a package-lock.json and a yarn.lock
