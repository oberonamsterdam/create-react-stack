import run from '../services/run';

export default {
    type: 'confirm',
    name: 'mobile',
    message: 'Are you building a mobile project? (https://facebook.github.io/react-native/)',
};

export const execute = async ({ answer, answers: { appname } }) => {
    if (answer) {
        // detect if name is hyphenated, store it here and run
        // a project rename after npx is done running
        // https://www.npmjs.com/package/react-native-rename
        await run(`npx react-native-cli init ${appname}`);
    }
};