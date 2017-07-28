import { combineReducers, compose, createStore } from 'redux';
// @coa-with-persist-start
import { autoRehydrate, persistStore } from 'redux-persist';
// @coa-with-persist-end

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export default (initial) => new Promise(resolve => {
    const store = createStore(
        combineReducers({
            // add your reducers here
        }),
        initial || {}
        // @coa-with-persist-start
        , composeEnhancers(
            autoRehydrate()
        )
        // @coa-with-persist-end
    );

    // @coa-with-persist-start
    if (typeof window !== 'undefined') {
        persistStore(store, {}, () => {
            resolve(store);
        });
    } else {
        resolve(store);
    }
    // @coa-with-persist-end
    // @coa-without-persist-start
    resolve();
    // @coa-without-persist-end
});