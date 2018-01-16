import { GENERATOR_TYPES } from '../globals/constants';
import createStore from './store';

const defaultState = {
    generator: GENERATOR_TYPES.createReactApp,
    ejected: false,
    error: '',
    answers: {},
};

export const store = createStore(defaultState);