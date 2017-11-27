import createStore from './store';

const defaultState = {
    createReactAppEjected: false,
    answers: [],
};

const store = createStore(defaultState);

export default store;