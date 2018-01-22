import check from 'check-types';
import { GENERATOR_TYPES } from '../globals/constants';
import { errors } from '../globals/snippets';
import { store } from '../store/createStore';

export const checkForValidAppname = (appname) => {
    const regex = /^\w+$/g;
    if (!regex.test(appname)) {
        store.changeState({
            error: errors.mobileNotAlphanumeric,
        });
    }
};

export const updateGenerator = (answers) => {
    const { reactNative, createReactApp, razzle } = GENERATOR_TYPES;
    const mobileAnswer = answers.mobile;
    const webAnswer = answers.reduxSsr;

    // if mobileAnswer is true
    if (mobileAnswer) {
        store.changeState({
            generator: reactNative,
        });
        // if web
    } else if (check.assigned(webAnswer)) {
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
        if (!!mobileAnswer && !!webAnswer && !!answers.appname) {
            throw new Error('Fatal error determining which generator to use.');
        }
    }
};