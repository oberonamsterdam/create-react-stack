import validator from 'validator';
import { GENERATOR_TYPES } from '../constants';
import { store } from '../createStore';
import run from '../services/run';
import { errors } from '../snippets';

export default {
    type: 'confirm',
    name: 'mobile',
    message: 'Are you building a mobile project? (https://facebook.github.io/react-native/)',
    validate: ({ appname }) => {
        if (validator.isAlphanumeric(appname)) {
            return true;
        } else {
            store.changeState({
                error: errors.mobileNotAlphanumeric,
            });
            return true;
        }
    },
};

export const execute = async ({ answers: { appname } }) => {
    store.changeState({
        generator: GENERATOR_TYPES.reactNativeCli,
    });
    await run(`npx react-native-cli init ${appname}`);
};