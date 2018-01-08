import { GENERATOR_TYPES } from '../constants';
import { store } from '../createStore';
import run from '../services/run';

export default {
    type: 'confirm',
    name: 'mobile',
    message: 'Are you building a mobile project? (https://facebook.github.io/react-native/)',
};

export const execute = async ({ answers: { appname } }) => {
    const currentGenerator = store.getState().generator;

    if (currentGenerator === GENERATOR_TYPES.reactNativeCli) {
        await run(`npx react-native-cli init ${appname}`);
    }
};