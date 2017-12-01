import createStore from './store';

const defaultState = {
    generator: '',
    ejected: false,
    error: '',
    answers: [],
};

export const store = createStore(defaultState);