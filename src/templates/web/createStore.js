import { combineReducers, compose, createStore } from 'redux';
// @crs-with-persist-start
import { autoRehydrate, persistStore } from 'redux-persist';
// @crs-with-persist-end

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export default (initial) => new Promise(resolve => {
    const store = createStore(
        combineReducers({
            // add your reducers here
        }),
        initial || {},
        composeEnhancers(
            // add your middleware here
            // @crs-with-persist-start
            autoRehydrate(),
            // @crs-with-persist-end
        ),
    );

    // @crs-with-persist-start
    if (typeof window !== 'undefined') {
        persistStore(store, {}, () => {
            resolve(store);
        });
    } else {
        resolve(store);
    }
    // @crs-with-persist-end
    // @crs-without-persist-start
    resolve(store);
    // @crs-without-persist-end
});