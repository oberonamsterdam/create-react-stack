import { combineReducers, compose, createStore } from 'redux';

const initialState = {};

export const store = createStore(
    combineReducers({
        // add your reducers here
    }),
    initialState,
    compose(
        // add your middleware here
    ),
);