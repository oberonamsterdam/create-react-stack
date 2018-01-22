import { combineReducers, compose, createStore } from 'redux';
// @crs-with-persist-start
import { autoRehydrate, persistStore } from 'redux-persist';
// @crs-with-persist-end

export default (initial) => new Promise(resolve => {
    const store = createStore(
        combineReducers({
            // add your reducers here
        }),
        initial || {},
        // etc.. TODO add webTemplate
    );
});