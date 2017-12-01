import validator from 'validator';
import { store } from '../createStore';
import { errors } from '../snippets';

export const checkForValidAppname = (appname) => {
    if (!validator.isAlphanumeric(appname)) {
        store.changeState({
            error: errors.mobileNotAlphanumeric,
        });
    }
};