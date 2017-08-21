import { combineReducers, compose, createStore } from 'redux';
// @crs-with-persist-start
import { autoRehydrate, persistStore } from 'redux-persist';
import { AsyncStorage } from 'react-native';
// @crs-with-persist-end

export default (initial) => {
    const store = createStore(
        combineReducers({
            // add your reducers here
        }),
        initial || {},
        compose(
            // @crs-with-persist-start
            autoRehydrate(),
            // @crs-with-persist-end
            global.reduxNativeDevTools ?
                global.reduxNativeDevTools(/*options*/) :
                (noop) => noop
        )
    );

    // @crs-with-persist-start
    persistStore(store, {
        storage: AsyncStorage
    });
    // @crs-with-persist-end
    return store;
}