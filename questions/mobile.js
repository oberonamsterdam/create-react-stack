import run from '../services/run';

export default {
    type: 'confirm',
    name: 'mobile',
    message: 'Are you building a mobile project? (https://facebook.github.io/react-native/)',
};

export const execute = async (answer, { appname }) => {
    if (answer) {
        await run(`npx react-native-cli init ${appname}`);
    }
};