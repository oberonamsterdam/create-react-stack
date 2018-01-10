import { QUESTION_TYPES } from '../constants';

export default {
    type: 'confirm',
    name: 'mobile',
    message: 'Are you building a mobile project? (https://facebook.github.io/react-native/)',
};

export const execReactNative = async (answers) => {

};
export const execRazzle = async (answers) => {

};
export const execCreateReactApp = async (answers) => {

};

export const execute = {
    [QUESTION_TYPES.mobile]: execReactNative,
    [QUESTION_TYPES.razzle]: execRazzle,
    [QUESTION_TYPES.createReactApp]: execCreateReactApp,
};

// export const execute = async ({ answers: { appname } }) => {
//     const currentGenerator = store.getState().generator;
//
//     if (currentGenerator === GENERATOR_TYPES.reactNative) {
//         await run(`npx create-react-native-app ${appname}`);
//     }
// };