import check from 'check-types';
import validator from 'validator';
import { GENERATOR_TYPES } from '../constants';
import { store } from '../createStore';
import { errors } from '../snippets';

export const checkForValidAppname = (appname) => {
    if (!validator.isAlphanumeric(appname)) {
        store.changeState({
            error: errors.mobileNotAlphanumeric,
        });
    }
};

export const updateGenerator = (answers) => {
    const { expo, createReactApp, reactNativeCli, razzle } = GENERATOR_TYPES;
    const mobileAnswer = answers.mobile;
    const webAnswer = answers.reduxSsr;

    // if mobile
    if (!check.assigned(webAnswer) && mobileAnswer) {
        const expoAnswer = answers.expo;
        if (expoAnswer === true) {
            // if expo
            store.changeState({
                generator: expo,
            });
        }
        if (expoAnswer === false) {
            // if react-native-cli
            store.changeState({
                generator: reactNativeCli,
            });
        }
        // if web
    } else if (check.assigned(webAnswer) && !mobileAnswer) {
        if (webAnswer === true) {
            // if razzle
            store.changeState({
                generator: razzle,
            });
        }
        if (webAnswer === false) {
            // if create-react-app
            store.changeState({
                generator: createReactApp,
            });
        }
    } else {
        // could not determine generator
    }
};