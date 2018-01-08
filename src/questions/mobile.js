import run from '../services/run';

export default {
    type: 'confirm',
    name: 'mobile',
    message: 'Are you building a mobile project? (https://facebook.github.io/react-native/)',
};

export const execute = async ({ answers: { appname, expo } }) => {
    if (!expo) {
        await run(`npx react-native-cli init ${appname}`);
    }
};