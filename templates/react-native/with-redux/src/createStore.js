import { combineReducers, compose, createStore } from 'redux';
// @coa-with-persist-start
import { autoRehydrate, persistStore } from 'redux-persist';
import { AsyncStorage } from 'react-native';
// @coa-with-persist-end

export default (initial) => {
    const store = createStore(
        combineReducers({
            blah: () => ({})
        }),
        initial || {},
        compose(
            // @coa-with-persist-start
            autoRehydrate(),
            // @coa-with-persist-end
            global.reduxNativeDevTools ?
                global.reduxNativeDevTools(/*options*/) :
                (noop) => noop
        )
    );

    // @coa-with-persist-start
    persistStore(store, {
        storage: AsyncStorage
    });
    // @coa-with-persist-end
    return store;
}